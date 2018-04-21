export interface OrderDefinition<T> {
  readonly key?:      KeyDefinition<T> | KeyDefinition<T>[]
  readonly desc?:     boolean
  readonly nulls?:    NullHandling
  readonly locales?:  string | string[]
  readonly collator?: Intl.Collator | Intl.CollatorOptions
}
export type KeyDefinition<T>  = string | number | KeySelector<T>
export type KeySelector<T>    = (element: T) => any | undefined
export type NullHandling      = 'first' | 'last' | 'min' | 'max'
export type Comparator<T>     = (a: T, b: T) => number

const defaultCollator = new Intl.Collator()

export default function comparing<T>(...orders: (OrderDefinition<T> | KeyDefinition<T>)[]): Comparator<any>
export default function comparing<T>() {
  const comparators = createComparators<T>(arguments)
  switch (comparators.length) {
    case 0:   return createComparator()
    case 1:   return comparators[0]
    case 2:   return (a: T, b: T) => comparators[0](a, b) || comparators[1](a, b)
    case 3:   return (a: T, b: T) => comparators[0](a, b) || comparators[1](a, b) || comparators[2](a, b)
    default:  return (a: T, b: T) => {
      let result = 0
      for (let i = 0; i < comparators.length && !(result = comparators[i](a, b)); ++i);
      return result
    }
  }
}

function createComparators<T>(orders: ArrayLike<OrderDefinition<T> | KeyDefinition<T>>): Comparator<T>[] {
  const comparators: Comparator<T>[] = []
  let order: OrderDefinition<T> | KeyDefinition<T>
  for (let i = 0; i < orders.length; ++i) {
    order = orders[i]
    if (typeof order === 'object' && order) {
      for (const key of Array.isArray(order.key) ? order.key : [order.key]) {
        comparators.push(createComparator(key, order.desc, order.nulls, order.locales, order.collator))
      }
    } else {
      comparators.push(createComparator(order))
    }
  }
  return comparators
}

function createComparator<T>(
  key?:             KeyDefinition<T>,
  desc?:            boolean,
  nulls?:           NullHandling,
  locales?:         string | string[],
  collatorOptions?: Intl.Collator | Intl.CollatorOptions
): Comparator<T> {
  const collator =
    collatorOptions instanceof Intl.Collator  ? collatorOptions :
    locales || collatorOptions                ? new Intl.Collator(locales, collatorOptions) :
                                                defaultCollator
  const keySelector =
    key === undefined || key === null || key === '' ? (term: T)   => term:
    typeof key === 'function'                       ? (term: T)   => { try { return key(term) } catch {} } :
                                                      (term: any) => { try { return term[key] } catch {} }
  const direction = desc ? -1 : 1
  const nullsResult =
    nulls === 'first' ? -direction :
    nulls === 'last'  ?  direction :
    nulls === 'max'   ?  1 :
                        -1
  function compare(a: any, b: any): number {
    return (
      a === b         ? 0 :
      a === undefined ?  nullsResult :
      b === undefined ? -nullsResult :
      a === null      ?  nullsResult :
      b === null      ? -nullsResult :
      Array.isArray(a) && Array.isArray(b) ? compareArray(a, b, compare) :
      typeof a === 'string' && typeof b === 'string' ? collator.compare(a, b) :
      (a < b ? -1 : 1)
    )
  }
  return (a: T, b: T) => {
    const result = compare(keySelector(a), keySelector(b))
    return result && result * direction
  }
}

function compareArray(a: (any | null | undefined)[], b: (any | null | undefined)[], compare: (a: any, b: any) => number) {
  let result = 0;
  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length && !(result = compare(a[i], b[i])); ++i);
  return result || compare(a.length, b.length)
}

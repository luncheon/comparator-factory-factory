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
      for (let i = 0; result === 0 && i < comparators.length; ++i) {
        result = comparators[i](a, b)
      }
      return result
    }
  }
}

function createComparators<T>(orders: ArrayLike<OrderDefinition<T> | KeyDefinition<T>>): Comparator<T>[] {
  const comparators: Comparator<T>[] = []
  let order: OrderDefinition<T> | KeyDefinition<T>
  for (let i = 0; i < orders.length; ++i) {
    order = orders[i]
    if (typeof order === 'object') {
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
  const collator = collatorOptions instanceof Intl.Collator ? collatorOptions :
    locales || collatorOptions ? new Intl.Collator(locales, collatorOptions) :
    defaultCollator
  const keySelector = createKeySelector(key)
  const direction = desc ? -1 : 1
  const nullsResult = nulls === 'first' ? -1 : nulls === 'last' ? 1 : direction * (nulls === 'max' ? 1 : -1)
  return (a: T, b: T) => {
    const A = keySelector(a)
    const B = keySelector(b)
    return (
      A === B         ? 0 :
      A === undefined ?  nullsResult :
      B === undefined ? -nullsResult :
      A === null      ?  nullsResult :
      B === null      ? -nullsResult :
      direction * (typeof A === 'string' && typeof B === 'string' ? collator.compare(A, B) : (A < B ? -1 : 1))
    )
  }
}

function createKeySelector<T>(key?: KeyDefinition<T>): KeySelector<T> {
  return (
    key === undefined         ? identity :
    typeof key === 'function' ? key :
    createPropertyGetter(String(key))
  )
}

function createPropertyGetter(path: string): KeySelector<any> {
  if (!path) {
    return identity
  }
  const paths: string[] = []
  {
    let lastIndex = -1
    for (let index = path.indexOf('.'); index !== -1; index = path.indexOf('.', index + 1)) {
      if (path[index - 1] !== '\\') {
        paths.push(path.slice(lastIndex + 1, index))
        lastIndex = index
      }
    }
    paths.push(path.slice(lastIndex + 1))
  }
  if (paths.length === 1) {
    const path = paths[0]
    return (element: any) => element[path]
  } else {
    return (element: any) => {
      for (const path of paths) {
        if (element === undefined || element === null) {
          return
        }
        element = element[path]
      }
      return element
    }
  }
}

function identity<T>(x: T): T {
  return x
}

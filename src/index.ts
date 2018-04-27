export type ComparatorFactory<K> = <T = any>(...keys: K[]) => Comparator<T>

export interface Comparator<T> {
  (a: T, b: T): number
  reversed(really?: boolean): Comparator<T>
  or(anotherComparator: PureComparator<T>): Comparator<T>
}

export interface ComparisonRule<K> {
  readonly selector?: (key: K) => (obj: any) => any
  readonly specials?: SpecialHandling[]
  readonly collator?: Intl.CollatorOptions & { locales?: string | string[] } | { compare(a: string, b: string): number }
}

export type PureComparator<T> = (a: T, b: T) => number
export type SpecialHandling = [any, 'first' | 'last']

export default function comparatorFactoryFactory<K = (obj: any) => any>(rule?: ComparisonRule<K>): ComparatorFactory<K> {
  return function<T>() {
    return addComparatorFeatures(createComparator<T, K>(rule || {}, arguments))
  }
}

// avoid trivial troubles on import
(comparatorFactoryFactory as any).default = comparatorFactoryFactory

function addComparatorFeatures<T>(comparator: PureComparator<T>): Comparator<T> {
  ;(comparator as Comparator<T>).reversed = (really = true) => really ? addComparatorFeatures((a, b) => { const result = comparator(a, b); return result && -result }) : comparator as Comparator<T>
  ;(comparator as Comparator<T>).or       = anotherComparator => addComparatorFeatures((a, b) => comparator(a, b) || anotherComparator(a, b))
  return comparator as Comparator<T>
}

function createComparator<T, K>(rule: ComparisonRule<K>, keys: ArrayLike<K>): PureComparator<T> {
  const comparators: (PureComparator<T>)[] = []
  for (let i = 0; i < keys.length; ++i) {
    comparators.push(_createComparator(rule, keys[i]))
  }
  switch (comparators.length) {
    case 0:   return _createComparator(rule)
    case 1:   return comparators[0]
    case 2:   return (a: T, b: T) => comparators[0](a, b) || comparators[1](a, b)
    case 3:   return (a: T, b: T) => comparators[0](a, b) || comparators[1](a, b) || comparators[2](a, b)
    default:  return (a: T, b: T) => {
      let result = 0
      for (let i = 0; i < comparators.length && (result = comparators[i](a, b)) === 0; ++i);
      return result
    }
  }
}

function _createComparator<T, K>(rule: ComparisonRule<K>, key?: K): PureComparator<T> {
  const valueSelector   = key ? (rule.selector || defaultSelector)(key) : (obj: T) => obj as any
  const compareSpecials = createSpecialsComparator(rule.specials)
  const collator        = rule.collator as Intl.CollatorOptions & { locales?: string | string[], compare(a: string, b: string): number }
  const compareString   = collator && typeof collator.compare === 'function' ? collator : Intl.Collator(collator && collator.locales, collator)
  const compareValue    = (a: any, b: any): number => {
    let result: number | undefined
    return (
      a === b         ? 0 :
      (result = compareSpecials && compareSpecials(a, b)) !== undefined ? result :
      a === undefined ? -1 :
      b === undefined ?  1 :
      a === null      ? -1 :
      b === null      ?  1 :
      a !== a         ?  b !== b ? 0 : -1 : // NaN !== NaN
      b !== b         ?                 1 :
      Array.isArray(a)      && Array.isArray(b)      ? compareArray(a, b, compareValue) :
      typeof a === 'string' || typeof b === 'string' ? compareString.compare(String(a), String(b)) :
      a < b ? -1 : 1
    )
  }
  return (a: T, b: T) => compareValue(valueSelector(a), valueSelector(b))
}

function createSpecialsComparator(specials?: SpecialHandling[]) {
  if (!specials || !specials.length) {
    return
  }
  const comparators = specials.map(([special, handling]) => {
    const isSpecial =
      typeof special === 'function' ? special :
      special !== special           ? (value?: any) => value !== value :
                                      (value?: any) => value === special
    const leftResult = handling === 'last' ? 1 : -1
    return (a?: any, b?: any) => isSpecial(a) ? isSpecial(b) ? 0 : leftResult : isSpecial(b) ? -leftResult : undefined
  })
  return (a?: any, b?: any) => {
    let result: number | undefined
    for (let i = 0; i < comparators.length && (result = comparators[i](a, b)) === undefined; ++i);
    return result
  }
}

function compareArray(a: any[], b: any[], compare: PureComparator<any>) {
  let result = 0;
  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length && !(result = compare(a[i], b[i])); ++i);
  return result || compare(a.length, b.length)
}

function defaultSelector(key: any) {
  if (typeof key !== 'function') {
    throw new Error('comparison key must be a function')
  } else {
    return (obj: any) => { try { return key(obj) } catch {} }
  }
}

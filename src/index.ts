export interface ComparatorFactory<K> {
  <T = any>(...keys: K[]): Comparator<T>
  resolvedRule: ComparisonRule<K>
  rule<Key = K>(rule: ComparisonRule<Key>): ComparatorFactory<Key>
}

export interface Comparator<T> {
  (a: T, b: T): number
  reverse(really?: boolean): Comparator<T>
  or(anotherComparator: (a: T, b: T) => number): Comparator<T>
}

export interface ComparisonRule<K> {
  readonly selector?: (key: K) => (obj: any) => any
  readonly desc?:     boolean
  readonly specials?: SpecialHandling[]
  readonly locales?:  string | string[]
  readonly collator?: Intl.CollatorOptions | { compare(a: string, b: string): number }
}

export type SpecialHandling = [undefined | null | number | string | boolean | object | ((value?: any) => any | undefined), 'first' | 'last' | 'min' | 'max']

export default createComparatorFactory<(obj: any) => any>({
  selector: key => obj => { try { return key(obj) } catch {} }
})

function createComparatorFactory<K>(rule: ComparisonRule<K>): ComparatorFactory<K> {
  const comparing = function<T>() {
    return addComparatorFeatures(createComparator<T, K>(rule, arguments))
  } as ComparatorFactory<K>
  comparing.resolvedRule = rule
  comparing.rule = newRule => createComparatorFactory(mergeRule(rule, newRule))
  return comparing
}

function addComparatorFeatures<T>(comparator: (a: T, b: T) => number): Comparator<T> {
  ;(comparator as Comparator<T>).reverse  = (really = true) => really ? addComparatorFeatures((a, b) => -comparator(a, b)) : comparator as Comparator<T>
  ;(comparator as Comparator<T>).or       = anotherComparator => addComparatorFeatures((a, b) => comparator(a, b) || anotherComparator(a, b))
  return comparator as Comparator<T>
}

function createComparator<T, K>(rule: ComparisonRule<K>, keys: ArrayLike<K>): (a: T, b: T) => number {
  const comparators: ((a: T, b: T) => number)[] = []
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

function _createComparator<T, K>(rule: ComparisonRule<K>, key?: K): (a: T, b: T) => number {
  const selector        = key ? rule.selector!(key) : (obj: T) => obj as any
  const direction       = rule.desc ? -1 : 1
  const compareSpecials = createSpecialsComparator(rule.specials, rule.desc)
  const collator        = rule.collator as Intl.CollatorOptions & { compare(a: string, b: string): number }
  const compareString   = collator && typeof collator.compare === 'function' ? collator : Intl.Collator(rule.locales, collator)
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
  return (a: T, b: T) => {
    const result = compareValue(selector(a), selector(b))
    return result && result * direction
  }
}

// will be multiplied by (desc ? -1 : 1)
const ascSpecialsHandlings  = { first: -1, last:  1, min: -1, max: 1 }
const descSpecialsHandlings = { first:  1, last: -1, min: -1, max: 1 }

function createSpecialsComparator(specials?: SpecialHandling[], desc?: boolean) {
  if (!specials || !specials.length) {
    return
  }
  const specialsHandlings = desc ? descSpecialsHandlings : ascSpecialsHandlings
  const comparators = specials.map(([special, handling]) => {
    const isSpecial =
      typeof special === 'function' ? special :
      special !== special           ? (value?: any) => value !== value :
                                      (value?: any) => value === special
    const leftResult = specialsHandlings[handling]
    return (a?: any, b?: any) => isSpecial(a) ? isSpecial(b) ? 0 : leftResult : isSpecial(b) ? -leftResult : undefined
  })
  return (a?: any, b?: any) => {
    let result: number | undefined
    for (let i = 0; i < comparators.length && (result = comparators[i](a, b)) === undefined; ++i);
    return result
  }
}

function compareArray(a: (any | null | undefined)[], b: (any | null | undefined)[], compare: (a: any, b: any) => number) {
  let result = 0;
  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length && !(result = compare(a[i], b[i])); ++i);
  return result || compare(a.length, b.length)
}

function mergeRule<K>(rule1: ComparisonRule<any>, rule2: ComparisonRule<K>): ComparisonRule<K> {
  return assignRule(assignRule({}, rule1), rule2)
}

function assignRule<K>(destination: any, source: ComparisonRule<K>): ComparisonRule<K> {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      destination[key] = source[key as keyof ComparisonRule<K>]
    }
  }
  return destination
}

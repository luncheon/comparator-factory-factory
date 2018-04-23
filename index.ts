export interface Comparing {
  <T>(...rules: (ComparisonRule<T> | ComparisonKey<T>)[]): Comparator<any>
  factory(baseRule: ComparisonRule<any>): Comparing
}
export interface ComparisonRule<T> {
  readonly key?:              ComparisonKey<T> | ComparisonKey<T>[]
  readonly keyValueSelector?: ComparisonKeyValueSelector<T>
  readonly desc?:             boolean
  readonly nulls?:            NullsHandling
  readonly locales?:          string | string[]
  readonly collator?:         Intl.CollatorOptions & { compare?(a: string, b: string): number }
}
export type ComparisonKey<T>              = string | number | ((obj: T) => any | null | undefined)
export type ComparisonKeyValueSelector<T> = (key?: ComparisonKey<T>) => (obj: T) => any
export type NullsHandling                 = 'first' | 'last' | 'min' | 'max'
export type Comparator<T>                 = (a: T, b: T) => number

const defaultCollator = Intl.Collator()

function defaultKeyValueSelector<T>(key?: ComparisonKey<T>): (obj: T) => number {
  return (
    key === undefined || key === null || key === '' ? (term: T)   => term:
    typeof key === 'function'                       ? (term: T)   => { try { return key(term) } catch {} } :
                                                      (term: any) => { try { return term[key] } catch {} }
  )
}

export default comparingFactory({})

function comparingFactory(baseRule: ComparisonRule<any>): Comparing {
  const comparing = function<T>() {
    const comparators = createComparators<T>(baseRule, arguments)
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
  } as Comparing
  comparing.factory = newRule => comparingFactory(mergeRule(baseRule, newRule))
  return comparing
}

function createComparators<T>(baseRule: ComparisonRule<T>, rules: ArrayLike<ComparisonRule<T> | ComparisonKey<T>>): Comparator<T>[] {
  const comparators: Comparator<T>[] = []
  let rule: ComparisonRule<T> | ComparisonKey<T>
  for (let i = 0; i < rules.length; ++i) {
    rule = rules[i]
    if (typeof rule === 'object' && rule) {
      rule = mergeRule(baseRule, rule)
      for (const key of Array.isArray(rule.key) ? rule.key : [rule.key]) {
        comparators.push(createComparator(key, rule))
      }
    } else {
      comparators.push(createComparator(rule, baseRule))
    }
  }
  return comparators
}

function createComparator<T>(key?: ComparisonKey<T>, rule?: ComparisonRule<T>): Comparator<T> {
  rule = rule || {}
  const { nulls, locales, collator } = rule
  const stringComparator =
    collator && collator.compare ?  collator as { compare(a: string, b: string): number } :
    locales || collator          ?  Intl.Collator(locales, collator) :
                                    defaultCollator
  const direction = rule.desc ? -1 : 1
  const nullsResult =
    nulls === 'first' ? -direction :
    nulls === 'last'  ?  direction :
    nulls === 'max'   ?  1 :
                        -1
  const keyValueSelector = (rule.keyValueSelector || defaultKeyValueSelector)(key)
  function compareValue(a: any | null | undefined, b: any | null | undefined): number {
    return (
      a === b         ? 0 :
      a === undefined ?  nullsResult :
      b === undefined ? -nullsResult :
      a === null      ?  nullsResult :
      b === null      ? -nullsResult :
      a !== a         ?  b !== b ? 0 : nullsResult : // NaN !== NaN
      b !== b         ?               -nullsResult :
      Array.isArray(a) && Array.isArray(b) ? compareArray(a, b, compareValue) :
      typeof a === 'string' && typeof b === 'string' ? stringComparator.compare(a, b) :
      a < b ? -1 : 1
    )
  }
  return (a: T, b: T) => {
    const result = compareValue(keyValueSelector(a), keyValueSelector(b))
    return result && result * direction
  }
}

function compareArray(a: (any | null | undefined)[], b: (any | null | undefined)[], compare: (a: any, b: any) => number) {
  let result = 0;
  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length && !(result = compare(a[i], b[i])); ++i);
  return result || compare(a.length, b.length)
}

function mergeRule<T>(rule1: ComparisonRule<any>, rule2: ComparisonRule<any>): ComparisonRule<T> {
  return assignRule(assignRule({}, rule1), rule2)
}

function assignRule(destination: any, source: ComparisonRule<any>): ComparisonRule<any> {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      destination[key] = source[key as keyof ComparisonRule<any>]
    }
  }
  return destination
}

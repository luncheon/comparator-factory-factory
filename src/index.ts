export interface Comparing {
  <T = any>(...rules: (ComparisonRule<T> | ComparisonKey<T>)[]): ReversibleComparator<T>
  rule: ComparisonRule<any>
  factory(baseRule: ComparisonRule<any>): Comparing
}
export interface ComparisonRule<T> {
  readonly key?:              ComparisonKey<T> | ComparisonKey<T>[]
  readonly keyValueSelector?: ComparisonKeyValueSelector<T>
  readonly desc?:             boolean
  readonly specials?:         SpecialHandling[]
  readonly locales?:          string | string[]
  readonly collator?:         Intl.CollatorOptions & { compare?(a: string, b: string): number }
}
export type SpecialHandling = [undefined | null | number | string | boolean | object | ((value?: any) => any | undefined), 'first' | 'last' | 'min' | 'max']
export type ComparisonKey<T>              = string | number | ((obj: T) => any | null | undefined)
export type ComparisonKeyValueSelector<T> = (key?: ComparisonKey<T>) => (obj: T) => any
export type Comparator<T>                 = (a: T, b: T) => number
export type ReversibleComparator<T>       = Comparator<T> & { reversed(reversed?: boolean): ReversibleComparator<T> }

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
  }
  const reversible = function<T>() {
    const comparator = comparing.apply(undefined, arguments) as ReversibleComparator<T>
    const reversedComparator = ((a: T, b: T) => -comparator(a, b)) as ReversibleComparator<T>
    comparator.reversed = (reversed = true) => reversed ? reversedComparator : comparator
    reversedComparator.reversed = (reversed = true) => reversed ? comparator : reversedComparator
    return comparator
  } as Comparing
  reversible.rule = baseRule
  reversible.factory = newRule => comparingFactory(mergeRule(baseRule, newRule))
  return reversible
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
  const { locales, collator } = rule
  const stringComparator =
    collator && collator.compare ?  collator as { compare(a: string, b: string): number } :
    locales || collator          ?  Intl.Collator(locales, collator) :
                                    defaultCollator
  const direction = rule.desc ? -1 : 1
  const specialComparator = createSpecialsComparator(rule.specials, rule.desc)
  const keyValueSelector = (rule.keyValueSelector || defaultKeyValueSelector)(key)
  function compareValue(a?: any, b?: any): number {
    let result: number | undefined
    return (
      a === b         ? 0 :
      (result = specialComparator && specialComparator(a, b)) !== undefined ? result :
      a === undefined ? -1 :
      b === undefined ?  1 :
      a === null      ? -1 :
      b === null      ?  1 :
      a !== a         ?  b !== b ? 0 : -1 : // NaN !== NaN
      b !== b         ?                 1 :
      Array.isArray(a) && Array.isArray(b) ? compareArray(a, b, compareValue) :
      typeof a === 'string' || typeof b === 'string' ? stringComparator.compare(String(a), String(b)) :
      a < b ? -1 : 1
    )
  }
  return (a: T, b: T) => {
    const result = compareValue(keyValueSelector(a), keyValueSelector(b))
    return result && result * direction
  }
}

const ascSpecialsHandlings  = { first: -1, last:  1, min: -1, max: 1 }
const descSpecialsHandlings = { first:  1, last: -1, min: -1, max: 1 }

function createSpecialsComparator(specials?: SpecialHandling[], desc?: boolean) {
  if (!specials || !specials.length) {
    return
  }
  const specialsHandlings = desc ? descSpecialsHandlings : ascSpecialsHandlings
  const comparators = specials
    .map(([special, handling]) => {
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

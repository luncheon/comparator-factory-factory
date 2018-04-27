import comparatorFactoryFactory from '..'
import assert from 'assert'

const comparing = comparatorFactoryFactory({
  specials: [[null, "last"]],
  collator: { caseFirst: "upper", numeric: true },
})

assert.deepStrictEqual(
  ["A5", "A1", null, "A3", "A10", "a3", "A7"].sort(comparing()),
  ["A1", "A3", "a3", "A5", "A7", "A10", null]
)

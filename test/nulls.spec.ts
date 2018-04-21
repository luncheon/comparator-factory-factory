import comparing from './comparing'

describe('nulls', () => {
  test('default', () => {
    const comparator = comparing({})
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('default desc', () => {
    const comparator = comparing({ desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('first', () => {
    const comparator = comparing({ nulls: 'first' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('first desc', () => {
    const comparator = comparing({ nulls: 'first', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('last', () => {
    const comparator = comparing({ nulls: 'last' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('last desc', () => {
    const comparator = comparing({ nulls: 'last', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('min', () => {
    const comparator = comparing({ nulls: 'min' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('min desc', () => {
    const comparator = comparing({ nulls: 'min', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('max', () => {
    const comparator = comparing({ nulls: 'last' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('max desc', () => {
    const comparator = comparing({ nulls: 'min' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })
})

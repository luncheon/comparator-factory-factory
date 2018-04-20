import compareBy from '../compare-by'

describe('nulls', () => {
  test('default', () => {
    const comparator = compareBy({})
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('default desc', () => {
    const comparator = compareBy({ desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('first', () => {
    const comparator = compareBy({ nulls: 'first' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('first desc', () => {
    const comparator = compareBy({ nulls: 'first', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('last', () => {
    const comparator = compareBy({ nulls: 'last' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('last desc', () => {
    const comparator = compareBy({ nulls: 'last', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('min', () => {
    const comparator = compareBy({ nulls: 'min' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })

  test('min desc', () => {
    const comparator = compareBy({ nulls: 'min', desc: true })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('max', () => {
    const comparator = compareBy({ nulls: 'last' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(1)
    expect(comparator('', undefined)).toBe(-1)
    expect(comparator(null, '')).toBe(1)
    expect(comparator('', null)).toBe(-1)
  })

  test('max desc', () => {
    const comparator = compareBy({ nulls: 'min' })
    expect(comparator(undefined, undefined)).toBe(0)
    expect(comparator(null, null)).toBe(0)
    expect(comparator(undefined, '')).toBe(-1)
    expect(comparator('', undefined)).toBe(1)
    expect(comparator(null, '')).toBe(-1)
    expect(comparator('', null)).toBe(1)
  })
})

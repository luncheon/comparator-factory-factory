import comparing from './comparing'

describe('factory', () => {
  test('nulls', () => {
    const nullsMax = comparing.rule({ specials: [[null, 'max']] })
    const data = [{ id: null }, { id: '' }, {}]
    expect(data.sort(nullsMax(x => x.id))).toEqual([{}, { id: '' }, { id: null }])
    expect(data.sort(nullsMax.rule({ specials: [[null, 'min']] })(x => x.id))).toEqual([{ id: null }, {}, { id: '' }])
  })
})

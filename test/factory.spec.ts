import comparing from './comparing'

describe('factory', () => {
  test('nulls', () => {
    const nullsMax = comparing.factory({ specials: [[null, 'max']] })
    const data = [{ id: null }, { id: '' }, {}]
    expect(data.sort(nullsMax('id'))).toEqual([{}, { id: '' }, { id: null }])
    expect(data.sort(nullsMax({ key: 'id', specials: [[null, 'min']] }))).toEqual([{ id: null }, {}, { id: '' }])
  })
})

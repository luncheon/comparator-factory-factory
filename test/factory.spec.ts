import comparing from './comparing'

describe('factory', () => {
  test('nulls', () => {
    const nullsMax = comparing.factory({ nulls: 'max' })
    const data = [{ id: null }, { id: '' }, {}]
    expect(data.sort(nullsMax('id'))).toEqual([{ id: '' }, { id: null }, {}])
    expect(data.sort(nullsMax({ key: 'id', nulls: 'min' }))).toEqual([{}, { id: null }, { id: '' }])
  })
})

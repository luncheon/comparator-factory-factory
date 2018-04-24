import comparing from './comparing'

describe('limitation', () => {
  test('`undefined` is always last', () => {
    expect(
      [{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(comparing({ key: 'id', specials: [[undefined, 'first']] }))
    ).toEqual(
      [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
    )

    expect(
      [3, 1, null, 7].sort(comparing({ specials: [[null, 'first']] }))
    ).toEqual(
      [null, 1, 3, 7]
    )

    expect(
      [3, 1, undefined, 7].sort(comparing({ specials: [[undefined, 'first']] }))
    ).toEqual(
      [1, 3, 7, undefined]
    )
  })
})

import comparatorFactoryFactory from './'

describe('limitation', () => {
  test('`undefined` is always last', () => {
    const comparing = comparatorFactoryFactory({ specials: [[undefined, 'first'], [null, 'first'], [NaN, 'first']] })

    expect(
      [{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(comparing(x => x.id))
    ).toEqual(
      [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
    )

    expect(
      [3, 1, null, 7].sort(comparing())
    ).toEqual(
      [null, 1, 3, 7]
    )

    expect(
      [3, 1, NaN, 7].sort(comparing())
    ).toEqual(
      [NaN, 1, 3, 7]
    )

    expect(
      [3, 1, undefined, 7].sort(comparing())
    ).toEqual(
      [1, 3, 7, undefined]
    )
  })
})

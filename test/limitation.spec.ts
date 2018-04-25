import comparing from './comparing'

describe('limitation', () => {
  test('`undefined` is always last', () => {
    const compare = comparing.rule({ specials: [[undefined, 'first'], [null, 'first'], [NaN, 'first']] })

    expect(
      [{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(compare(x => x.id))
    ).toEqual(
      [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
    )

    expect(
      [3, 1, null, 7].sort(compare())
    ).toEqual(
      [null, 1, 3, 7]
    )

    expect(
      [3, 1, NaN, 7].sort(compare())
    ).toEqual(
      [NaN, 1, 3, 7]
    )

    expect(
      [3, 1, undefined, 7].sort(compare())
    ).toEqual(
      [1, 3, 7, undefined]
    )
  })
})

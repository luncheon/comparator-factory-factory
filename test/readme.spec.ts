import comparing from './comparing'

describe('readme', () => {
  test('01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparing())
  ).toEqual(
    [null, 'A1', 'A10', 'a3', 'A3', 'A5', 'A7']
  ))

  test('01-01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparing(null))
  ).toEqual(
    [null, 'A1', 'A10', 'a3', 'A3', 'A5', 'A7']
  ))

  test('02', () => {
    const comparingNumericUpperFirst = comparing.rule({ specials: [[null, 'last']], collator: { caseFirst: 'upper', numeric: true } })
    expect(
      ['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparingNumericUpperFirst())
    ).toEqual(
      ['A1', 'A3', 'a3', 'A5', 'A7', 'A10', null]
    )
    expect(
      ['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparingNumericUpperFirst().reverse())
    ).toEqual(
      [null, 'A10', 'A7', 'A5', 'a3', 'A3', 'A1']
    )
  })

  test('02-01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing.rule({ specials: [[null, 'last']], collator: Intl.Collator(undefined, { numeric: true }) })())
  ).toEqual(
    ['A1', 'A3', 'A5', 'A7', 'A10', null]
  ))

  const users = [
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '02', name: 'Bob'                         },
    { id: '03',                profile: { age: 16 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
  ]

  test('users01', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-02', () => expect(
    users.sort(comparing(x => x.profile.age, x => x.UNDEFINED, x => x.id))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-02', () => expect(
    users.sort(comparing(x => x.UNDEFINED, x => x.profile.age, x => x.UNDEFINED, x => x.id))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-03', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reverse())
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users01-03', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reverse(false))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-04', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reverse().reverse())
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-05', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reverse().reverse(false))
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users02', () => expect(
    users.sort(comparing(({ name }) => name, ({ id }) => id))
  ).toEqual([
    { id: '03',                profile: { age: 16 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '02', name: 'Bob'                         },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
  ]))

  test('users03', () => expect(
    users.sort(
      comparing
        .rule({ specials: [[undefined, 'last']], collator: { sensitivity: 'base' } })(x => x.name)
        .reverse()
        .or(comparing.rule({ specials: [[undefined, 'last']] })(x => x.profile.age))
        .or(comparing(x => x.id))
    )
  ).toEqual([
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
  ]))

  test('selector', () => {
    const compareByPropertyPath = comparing.rule({
      selector(fullpath: string) {
        const paths = fullpath.replace(/\[(\d+)]/g, '.$1').split('.').filter(Boolean);
        return obj => paths.every(path => (obj = obj[path]) != null) && obj;
      },
    });
    expect(
      users.sort(compareByPropertyPath('profile.age', 'id'))
    ).toEqual([
      { id: '02', name: 'Bob'                         },
      { id: '04', name: 'alice', profile: { age: 15 } },
      { id: '06', name: 'Bob',   profile: { age: 15 } },
      { id: '03',                profile: { age: 16 } },
      { id: '01', name: 'Alice', profile: { age: 17 } },
      { id: '05', name: 'bob',   profile: { age: 18 } },
    ])
  })
})

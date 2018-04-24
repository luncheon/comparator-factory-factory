import comparing from './comparing'

describe('readme', () => {
  test('01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing())
  ).toEqual(
    [null, 'A1', 'A10', 'A3', 'A5', 'A7']
  ))

  test('01-01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing(null))
  ).toEqual(
    [null, 'A1', 'A10', 'A3', 'A5', 'A7']
  ))

  test('01-02', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing(''))
  ).toEqual(
    [null, 'A1', 'A10', 'A3', 'A5', 'A7']
  ))

  test('02', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing({ specials: [[null, 'last']], collator: { numeric: true } }))
  ).toEqual(
    ['A1', 'A3', 'A5', 'A7', 'A10', null]
  ))

  test('02-01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing({ specials: [[null, 'last']], collator: new Intl.Collator(undefined, { numeric: true }) }))
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
    users.sort(comparing('UNDEFINED', x => x.profile.age, 'UNDEFINED', 'id'))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-03', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reversed())
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users01-03', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reversed(false))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-04', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reversed().reversed())
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-05', () => expect(
    users.sort(comparing(x => [x.profile.age, x.id]).reversed().reversed(false))
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users02', () => expect(
    users.sort(comparing(({ name }) => name, 'id'))
  ).toEqual([
    { id: '03',                profile: { age: 16 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '02', name: 'Bob'                         },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
  ]))

  test('users03', () => expect(
    users.sort(comparing(
      { key: 'name', desc: true, specials: [[undefined, 'first']], collator: { sensitivity: 'base' } },
      { key: x => x.profile.age, specials: [[undefined, 'max']] },
      'id',
    ))
  ).toEqual([
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
  ]))
})

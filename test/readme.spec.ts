import comparing from '../index.ts'

describe('readme', () => {
  test('01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing())
  ).toEqual(
    [null, 'A1', 'A10', 'A3', 'A5', 'A7']
  ))

  test('02', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing({ nulls: 'last', collator: { numeric: true } }))
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
    users.sort(comparing('profile.age', 'id'))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
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
      { key: 'name', desc: true, nulls: 'first', collator: { sensitivity: 'base' } },
      { key: 'profile.age', nulls: 'max' },
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

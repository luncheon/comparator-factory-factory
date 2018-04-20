import compareBy from '../compare-by'

describe('readme', () => {
  test('01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(compareBy())
  ).toEqual(
    [null, 'A1', 'A10', 'A3', 'A5', 'A7']
  ))

  test('02', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(compareBy({ nulls: 'last', collator: { numeric: true } }))
  ).toEqual(
    ['A1', 'A3', 'A5', 'A7', 'A10', null]
  ))

  const users = [
    { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
    { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
    { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
    { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
    { id: '05', name: 'bob',     profile: { age: 18 } },
    { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
  ]

  test('users01', () => expect(
    users.sort(compareBy('profile.age', 'id'))
  ).toEqual([
    { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
    { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
    { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
    { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
    { id: '05', name: 'bob',     profile: { age: 18 } },
    { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
  ]))

  test('users02', () => expect(
    users.sort(compareBy(({ name }) => name, 'id'))
  ).toEqual([
    { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
    { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
    { id: '05', name: 'bob',     profile: { age: 18 } },
    { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
    { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
    { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
  ]))

  test('users03', () => expect(
    users.sort(compareBy(
      { key: 'name', desc: true, nulls: 'first', collator: { caseFirst: 'false' } },
      { key: ['profile.age', 'tels.0'], nulls: 'max' },
      'id',
    ))
  ).toEqual([
    { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
    { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
    { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
    { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
    { id: '05', name: 'bob',     profile: { age: 18 } },
    { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
  ]))
})

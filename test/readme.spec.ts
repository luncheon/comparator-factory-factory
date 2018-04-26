import comparatorFactoryFactory from './'

describe('readme', () => {
  describe('01', () => {
    test('01', () => {
      const comparing1 = comparatorFactoryFactory({
        specials: [[null, "last"]],
        collator: { caseFirst: "upper", numeric: true },
      });
      const comparing2 = comparatorFactoryFactory({
        specials: [[null, "last"]],
        collator: Intl.Collator('en', { caseFirst: "upper", numeric: true }),
      });
      expect(
        ["A5", "A1", null, "A3", "A10", "a3", "A7"].sort(comparing1())
      ).toEqual(
        ["A1", "A3", "a3", "A5", "A7", "A10", null]
      )
      expect(
        ["A5", "A1", null, "A3", "A10", "a3", "A7"].sort(comparing1().reversed())
      ).toEqual(
        [null, "A10", "A7", "A5", "a3", "A3", "A1"]
      )
    })
  })

  test('02-01', () => expect(
    ['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparatorFactoryFactory({ specials: [[null, 'last']], collator: Intl.Collator(undefined, { numeric: true }) })())
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

  test('users01', () => expect((() => {
    const comparing = comparatorFactoryFactory();
    return users.sort(comparing(x => [x.profile.age, x.id]))
  })()).toEqual([
    { id: "02", name: "Bob"                         },
    { id: "04", name: "alice", profile: { age: 15 } },
    { id: "06", name: "Bob",   profile: { age: 15 } },
    { id: "03",                profile: { age: 16 } },
    { id: "01", name: "Alice", profile: { age: 17 } },
    { id: "05", name: "bob",   profile: { age: 18 } },
  ]))

  test('users01-02', () => expect(
    users.sort(comparatorFactoryFactory()(x => x.profile.age, x => x.UNDEFINED, x => x.id))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-02', () => expect(
    users.sort(comparatorFactoryFactory()(x => x.UNDEFINED, x => x.profile.age, x => x.UNDEFINED, x => x.id))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-03', () => expect(
    users.sort(comparatorFactoryFactory()(x => [x.profile.age, x.id]).reversed())
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users01-03', () => expect(
    users.sort(comparatorFactoryFactory()(x => [x.profile.age, x.id]).reversed(false))
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-04', () => expect(
    users.sort(comparatorFactoryFactory()(x => [x.profile.age, x.id]).reversed().reversed())
  ).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('users01-05', () => expect(
    users.sort(comparatorFactoryFactory()(x => [x.profile.age, x.id]).reversed().reversed(false))
  ).toEqual([
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '02', name: 'Bob'                         },
  ]))

  test('users02', () => expect((() => {
    const comparing1 = comparatorFactoryFactory({
      specials: [[undefined, "last"]],
      collator: { sensitivity: "base" },
    });
    const comparing2 = comparatorFactoryFactory({
      specials: [[undefined, "last"]],
    });
    return users.sort(
      comparing1(x => x.name)
        .reversed()
        .or(comparing2(x => x.profile.age))
        .or(comparing2(x => x.id))
    )
  })()).toEqual([
    { id: '03',                profile: { age: 16 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
  ]))

  test('selector', () => expect((() => {
    const comparingPropertyPath = comparatorFactoryFactory({
      selector(fullpath: string) {
        const paths = fullpath.replace(/\[(\d+)]/g, ".$1").split(".").filter(Boolean);
        return obj => paths.every(path => (obj = obj[path]) != null) && obj;
      },
    });

    return users.sort(comparingPropertyPath("profile.age", "id"));
  })()).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))

  test('lodash/get', () => expect((() => {
    const get = require('lodash/get')
    const comparingPropertyPath = comparatorFactoryFactory<string>({ selector: key => obj => get(obj, key) });

    return users.sort(comparingPropertyPath("profile.age", "id"));
  })()).toEqual([
    { id: '02', name: 'Bob'                         },
    { id: '04', name: 'alice', profile: { age: 15 } },
    { id: '06', name: 'Bob',   profile: { age: 15 } },
    { id: '03',                profile: { age: 16 } },
    { id: '01', name: 'Alice', profile: { age: 17 } },
    { id: '05', name: 'bob',   profile: { age: 18 } },
  ]))
})

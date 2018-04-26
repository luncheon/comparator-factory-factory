# comparator-factory-factory

Create a comparison function to be used for sorting arrays.


## Features

* Function-based comparison value selection
  * Property-path-based comparison value selection can be implemented easily
* Handling `undefined`, `null`, `NaN` as first or last
* String collation using native `Intl.Collator`
  * Locale-specific collation
  * Case order: case-insensitive / upper-first / lower-first
  * Numeric collation such that "1" < "2" < "10"
  * [See Intl.Collator at MDN for details](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator)
* Chaining comparison functions
* Lightweight (< 1kb gzipped IIFE)

## Install

> _T.B.D._

<!-- ### via npm

```bash
$ npm install comparator-factory-factory
```

```javascript
import comparatorFactoryFactory from "comparator-factory-factory";
// const comparatorFactoryFactory = require("comparator-factory-factory");

const comparing = comparatorFactoryFactory({});

[].sort(comparing());
```

### via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/comparator-factory-factory@0.1.0"></script>
<script>
  const comparing = comparatorFactoryFactory({});
  [].sort(comparing());
</script>
``` -->


## Usage & Examples

```javascript
const comparing = comparatorFactoryFactory({
  specials: [[null, "last"]],
  collator: { caseFirst: "upper", numeric: true },
});

["A5", "A1", null, "A3", "A10", "a3", "A7"].sort(comparing());
// => ["A1", "A3", "a3", "A5", "A7", "A10", null]

["A5", "A1", null, "A3", "A10", "a3", "A7"].sort(comparing().reversed());
// => [null, "A10", "A7", "A5", "a3", "A3", "A1"]
```

```javascript
const users = [
  { id: "01", name: "Alice", profile: { age: 17 } },
  { id: "02", name: "Bob"                         },
  { id: "03",                profile: { age: 16 } },
  { id: "04", name: "alice", profile: { age: 15 } },
  { id: "05", name: "bob",   profile: { age: 18 } },
  { id: "06", name: "Bob",   profile: { age: 15 } },
];

{
  const comparing = comparatorFactoryFactory();
  users.sort(comparing(x => [x.profile.age, x.id]));
  // => [
  //  { id: "02", name: "Bob"                         },
  //  { id: "04", name: "alice", profile: { age: 15 } },
  //  { id: "06", name: "Bob",   profile: { age: 15 } },
  //  { id: "03",                profile: { age: 16 } },
  //  { id: "01", name: "Alice", profile: { age: 17 } },
  //  { id: "05", name: "bob",   profile: { age: 18 } },
  // ]
}

{
  const comparing1 = comparatorFactoryFactory({
    specials: [[undefined, "last"]],
    collator: { sensitivity: "base" },
  });
  const comparing2 = comparatorFactoryFactory({
    specials: [[undefined, "last"]],
  });
  users.sort(
    comparing1(x => x.name)
      .reversed()
      .or(comparing2(x => x.profile.age))
      .or(comparing2(x => x.id))
  );
  // => [
  //  { id: "03",                profile: { age: 16 } },
  //  { id: "06", name: "Bob",   profile: { age: 15 } },
  //  { id: "05", name: "bob",   profile: { age: 18 } },
  //  { id: "02", name: "Bob"                         },
  //  { id: "04", name: "alice", profile: { age: 15 } },
  //  { id: "01", name: "Alice", profile: { age: 17 } },
  // ]
}

{
  const comparingPropertyPath = comparatorFactoryFactory({
    selector(fullpath) {
      const paths = fullpath.replace(/\[(\d+)]/g, ".$1").split(".").filter(Boolean);
      return obj => paths.every(path => (obj = obj[path]) != null) && obj;
    },
  });

  users.sort(comparingPropertyPath("profile.age", "id"));
  // => [
  //   { id: "02", name: "Bob"                         },
  //   { id: "04", name: "alice", profile: { age: 15 } },
  //   { id: "06", name: "Bob",   profile: { age: 15 } },
  //   { id: "03",                profile: { age: 16 } },
  //   { id: "01", name: "Alice", profile: { age: 17 } },
  //   { id: "05", name: "bob",   profile: { age: 18 } },
  // ]
}
```


## API

```javascript
// Create a comparison function factory based on the specified rule.
const comparatorFactory = comparatorFactoryFactory({
  selector: key => obj => comparisonResult,
  specials: [[undefined, "first"], [null, "first"], [NaN, "first"]],
  collator: Intl.Collator(),
  locales:  "ja-JP",
});

// Create a comparison function.
const comparator = comparatorFactory(key1, key2, ...);

// Create a reversed comparison function.
const reversedComparator = comparator.reversed();

// Comparator itself.
const comparatorItself = comparator.reversed(false);

// Create a combined comparison function.
// If comparator(obj1, obj2) === 0 (or falsy), then evaluate specified comparison function.
const combinedComparator = comparator.or((obj1, obj2) => number);

// Evaluate.
// 0 if obj1 and obj2 are equal.
// Negative number if obj1 is smaller.
// Positive number if obj1 is larger.
const comparisonResult = comparator(obj1, obj2);
```

### comparatorFactoryFactory({ selector?, specials?, locales?, collator? }) => comparaotrFactory

#### Parameters

* `selector`

  A function selecting comparison value from `key` and `obj`.  
  Passed parameter `key` is each argument of `comparatorFactory(key1, key2, ...)`.  
  Passed parameter `obj` is each argument of `comparator(obj1, obj2)`.  
  The default implementation is as follows.

  ```javascript
  key => obj => {
    try {
      return key(obj);
    } catch {
      return undefined;
    }
  }
  ```

  Following code is a property-path-based comparison example using [lodash](https://www.npmjs.com/package/lodash)/get.

  ```javascript
  const get = require("lodash/get");
  const comparingPropertyPath = comparatorFactoryFactory({ selector: key => obj => get(obj, key) });
  // for TypeScript:
  // const comparingPropertyPath = comparatorFactoryFactory<string>({ selector: key => obj => get(obj, key) });

  const users = [
    { id: 1, profile: { age: 18 } },
    { id: 2, profile: { age: 15 } },
  ];

  users.sort(comparingPropertyPath("profile.age", "id"));
  ```

* `specials`

  Special values to place first or last.  
  The default value is as follows.

  ```javascript
  [
    [undefined, "first"],
    [null,      "first"],
    [NaN,       "first"],
  ]
  ```

* `collator`

  String comparison method.  
  Possible values are as follows.

  * An options object of `Intl.Collator` constructor
  * An `Intl.Collator` instance
  * An object that has `compare(string1, string2) => number` method

  The default value is the default `Intl.Collator()`.

* `locales`

  Locales for `Intl.Collator`.  
  Used only if the `collator` option above does not has `compare()` method (means the `collator` is an options object of `Intl.Collator` constructor).  
  The default value is `undefined`.


## Limitation

`Array.prototype.sort()` always put the `undefined` at the end of the array.  
This behavior is specified in the [ECMAScript specification](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.11).

```javascript
const comparing = comparatorFactoryFactory({ specials: [[undefined, "first"], [null, "first"], [NaN, "first"]] });

[{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(comparing(x => x.id));
// => [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
// As expected.

[3, 1, null, 7].sort(comparing());
// => [null, 1, 3, 7]
// As expected.

[3, 1, NaN, 7].sort(comparing());
// => [NaN, 1, 3, 7]
// As expected.

[3, 1, undefined, 7].sort(comparing());
// => [1, 3, 7, undefined]
// NOT as expected.
// The expected result is [undefined, 1, 3, 7] but `undefined` is always placed at the end...
```


## License

WTFPL


## Similar modules

* [compare-func](https://www.npmjs.com/package/compare-func)
* [default-compare](https://www.npmjs.com/package/default-compare)
* [comparators](https://www.npmjs.com/package/comparators)
* [ts-comparators](https://www.npmjs.com/package/ts-comparators)

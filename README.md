# comparator-factory-factory

Create comparison functions to be used for sorting arrays.  
This is a dedicated tiny library, not aiming at a [framework](http://discuss.joelonsoftware.com/default.asp?joel.3.219431.12).


## Features

* Available for both Node.js and browsers (including IE 11)
* Function-based comparison value selection
  * Property-path-based comparison value selection can be implemented easily
* Handling `undefined`, `null`, `NaN` as first or last
* String collation using native `Intl.Collator`
  * Locale-specific collation
  * Case order: case-insensitive / upper-first / lower-first
  * Numeric collation such that "1" < "2" < "10"
  * [See Intl.Collator at MDN for details](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator)
* Chaining comparison functions
* Designed to share the comparison rule in the product;  
  Creating not a comparison function directly but a comparison function factory that may be shared
* Lightweight (~1.6kB minified, ~0.7kB gzipped)

## Install

### via npm

```bash
$ npm install comparator-factory-factory
```

```javascript
import comparatorFactoryFactory from "comparator-factory-factory";
// const comparatorFactoryFactory = require("comparator-factory-factory");

const comparing = comparatorFactoryFactory();
[].sort(comparing());
```

### via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/comparator-factory-factory@0.2.0"></script>
<script>
  const comparing = comparatorFactoryFactory();
  [].sort(comparing());
</script>
```

or for [modern browsers](https://caniuse.com/#feat=es6-module):

```html
<script type="module">
  import comparatorFactoryFactory from "https://cdn.jsdelivr.net/npm/comparator-factory-factory@0.2.0/index.min.mjs";

  const comparing = comparatorFactoryFactory();
  [].sort(comparing());
</script>
```


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

### Summary

```javascript
// Create a comparison function factory based on the specified rule.
const comparatorFactory = comparatorFactoryFactory({
  selector: key => obj => comparisonResult,
  specials: [
    [undefined, "first"],
    [null,      "first"],
    [NaN,       "first"],     // array with 2 elements: [0] value to treat specially, [1] "first" / "last"
  ],
  collator: {
    locales:      undefined,  // a BCP 47 language tag, or an array of such strings
    sensitivity:  "variant",  // "base" / "accent" / "case" / "variant"
    numeric:      false,
    caseFirst:    "false",    // "upper" / "lower" / "false" (use the locale's default)
  },
});

// Create a comparison function.
const comparator = comparatorFactory(key1, key2, ...);

// Evaluate.
// 0 if obj1 and obj2 are equal, a negative number if obj1 is smaller, a positive number if obj1 is larger.
const comparisonResult = comparator(obj1, obj2);

// Create a comparison function with reverse order.
const reversedComparator = comparator.reversed();

// Comparator itself.
const comparatorItself = comparator.reversed(false);

// Create a combined comparison function.
// If comparator(obj1, obj2) === 0 (or falsy), then evaluate specified comparison function.
const combinedComparator = comparator.or((obj1, obj2) => number);
```

### comparatorFactoryFactory({ selector?, specials?, locales?, collator? }) => comparatorFactory

Create a comparison function factory based on the specified rule.

#### Parameters

* `selector: key => obj => comparisonResult`

  A function selecting comparison value from `key` and `obj`.  
  The receiving parameter `key` is each argument of `comparatorFactory(key1, key2, ...)`.  
  The receiving parameter `obj` is each argument of `comparator(obj1, obj2)`.  
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

  Following code is a property-path-based comparison example using [lodash/get](https://lodash.com/docs/#get). (BTW, there are so many [similar modules](http://www.npmtrends.com/lodash-vs-underscore-vs-get-value-vs-dot-prop-vs-object-path-vs-pathval-vs-object-resolve-path-vs-fast-get-vs-selectn).)

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

* `specials: [[value1, "first" (or "last")], [value2, "first" (or "last")], ...]`

  Special values to place first or last.  
  The default value is as follows.

  ```javascript
  [
    [undefined, "first"],
    [null,      "first"],
    [NaN,       "first"],
  ]
  ```

* `collator: { locales?, sensitivity?, numeric?, caseFirst? } | { compare: (string1, string2) => number }`

  String comparison method.  
  Possible values are as follows.

  * An options object for `Intl.Collator` constructor with optional property `locales`
  * An object that has `compare(string1, string2) => number` method
    * `Intl.Collator` instances have the `compare(string1, string2) => number` method

  [See Intl.Collator at MDN for details.](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator)  
  The default value is the default `Intl.Collator()`.

### comparatorFactory(key1, key2, ...) => comparator

Create a comparison function.

#### Parameters

* `key1`, `key2`, ...

  Comparison key passed to the `selector` option of the rule.  
  If the length of arguments is 0, `obj` itself becomes the comparison value.

### comparator(obj1, obj2) => number

Evaluate.

0 if `obj1` and `obj2` are considered to be equal,  
a negative number if `obj1` is considered to be smaller than `obj2`,  
a positive number if `obj1` is considered to be larger than `obj2`.

### comparator.reversed(really? = true) => comparator

Create a comparison function with reverse order.

### comparator.or((obj1, obj2) => number) => comparator

Create a combined comparison function.

The combined comparison function evaluates the original `comparator(obj1, obj2)` first.  
If that result equals to 0 (or falsy), it evaluates specified comparison function next.


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

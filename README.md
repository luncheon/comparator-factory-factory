# comparing

Create a comparison function to be used for sorting arrays.


## Install

```bash
T.B.D.
```

## Usage & Examples

```javascript
import comparing from 'comparing';
// const comparing = require('comparing');

['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparing());
// => [null, 'A1', 'A10', 'a3', 'A3', 'A5', 'A7']
```

```javascript
const comparingNumericUpperFirst = comparing.rule({
  specials: [[null, 'last']],
  collator: { caseFirst: 'upper', numeric: true },
});

['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparingNumericUpperFirst());
// => ['A1', 'A3', 'a3', 'A5', 'A7', 'A10', null]

['A5', 'A1', null, 'A3', 'A10', 'a3', 'A7'].sort(comparingNumericUpperFirst().reversed());
// => [null, 'A10', 'A7', 'A5', 'a3', 'A3', 'A1']
```

```javascript
const users = [
  { id: '01', name: 'Alice', profile: { age: 17 } },
  { id: '02', name: 'Bob'                         },
  { id: '03',                profile: { age: 16 } },
  { id: '04', name: 'alice', profile: { age: 15 } },
  { id: '05', name: 'bob',   profile: { age: 18 } },
  { id: '06', name: 'Bob',   profile: { age: 15 } },
];

users.sort(comparing(x => [x.profile.age, x.id]))
// => [
//  { id: '02', name: 'Bob'                         },
//  { id: '04', name: 'alice', profile: { age: 15 } },
//  { id: '06', name: 'Bob',   profile: { age: 15 } },
//  { id: '03',                profile: { age: 16 } },
//  { id: '01', name: 'Alice', profile: { age: 17 } },
//  { id: '05', name: 'bob',   profile: { age: 18 } },
// ]

users.sort(
  comparing
    .rule({ specials: [[undefined, 'last']], collator: { sensitivity: 'base' } })(x => x.name)
    .reversed()
    .or(comparing.rule({ specials: [[undefined, 'last']] })(x => x.profile.age))
    .or(comparing(x => x.id))
);
// => [
//  { id: '03',                profile: { age: 16 } },
//  { id: '06', name: 'Bob',   profile: { age: 15 } },
//  { id: '05', name: 'bob',   profile: { age: 18 } },
//  { id: '02', name: 'Bob'                         },
//  { id: '04', name: 'alice', profile: { age: 15 } },
//  { id: '01', name: 'Alice', profile: { age: 17 } },
// ]
```


## API

> _T.B.D._

### comparing

#### comparing.rule(comparisonRule) => comparing
#### comparing(...keys) => comparator

### comparator
#### comparator(a, b) => number
#### comparator.reversed(really?) => comparator
#### comparator.or(anotherComparator) => comparator

<!--
Collator
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator -->

## Limitation

`Array.prototype.sort()` always put the `undefined` at the end of the array.  
This behavior is specified in the [ECMAScript specification](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.11).

```javascript
const compare = comparing.rule({ specials: [[undefined, 'first'], [null, 'first'], [NaN, 'first']] });

[{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(compare(x => x.id));
// => [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
// As expected.

[3, 1, null, 7].sort(compare());
// => [null, 1, 3, 7]
// As expected.

[3, 1, NaN, 7].sort(compare());
// => [NaN, 1, 3, 7]
// As expected.

[3, 1, undefined, 7].sort(compare());
// => [1, 3, 7, undefined]
// NOT as expected.
// The expected result is [undefined, 1, 3, 7] but `undefined` is always placed at the end...
```


## Similar modules

* [compare-func](https://www.npmjs.com/package/compare-func)
* [default-compare](https://www.npmjs.com/package/default-compare)
* [comparators](https://www.npmjs.com/package/comparators)

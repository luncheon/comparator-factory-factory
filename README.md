# comparing

Create a comparison function to be used for sorting arrays.


## Usage & Examples

```javascript
import comparing from 'comparing';
// const comparing = require('comparing');

['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing());
// => [null, 'A1', 'A10', 'A3', 'A5', 'A7']

['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(comparing({ specials: [[null, 'last']], collator: { numeric: true } }))
// => ['A1', 'A3', 'A5', 'A7', 'A10', null]

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

users.sort(comparing(x => [x.profile.age, x.id]).reversed())
// => [
//  { id: '05', name: 'bob',   profile: { age: 18 } },
//  { id: '01', name: 'Alice', profile: { age: 17 } },
//  { id: '03',                profile: { age: 16 } },
//  { id: '06', name: 'Bob',   profile: { age: 15 } },
//  { id: '04', name: 'alice', profile: { age: 15 } },
//  { id: '02', name: 'Bob'                         },
// ]

users.sort(comparing(x => [x.profile.age, x.id]).reversed(false))
// => [
//  { id: '02', name: 'Bob'                         },
//  { id: '04', name: 'alice', profile: { age: 15 } },
//  { id: '06', name: 'Bob',   profile: { age: 15 } },
//  { id: '03',                profile: { age: 16 } },
//  { id: '01', name: 'Alice', profile: { age: 17 } },
//  { id: '05', name: 'bob',   profile: { age: 18 } },
// ]

users.sort(comparing(({ name }) => name, 'id'));
// => [
//  { id: '03',                profile: { age: 16 } },
//  { id: '04', name: 'alice', profile: { age: 15 } },
//  { id: '01', name: 'Alice', profile: { age: 17 } },
//  { id: '05', name: 'bob',   profile: { age: 18 } },
//  { id: '02', name: 'Bob'                         },
//  { id: '06', name: 'Bob',   profile: { age: 15 } },
// ]

users.sort(comparing(
  { key: 'name', desc: true, specials: [[undefined, 'first']], collator: { sensitivity: 'base' } },
  { key: x => x.profile.age, specials: [[undefined, 'max']] },
  'id',
));
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

### comparing(...comparisonRules) => reversibleComparator
### reversibleComparator(a, b) => -1 | 0 | 1
### reversibleComparator.reversed() => reversedReversibleComparator
### reversibleComparator.reversed(false) => reversibleComparator
### comparing.factory(comparisonRule) => comparing

> _T.B.D._

<!--
comparing(...comparisonRules) => (a, b) => (-1 | 0 | 1)
Collator
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator -->

## Limitation

`Array.prototype.sort()` always put the `undefined` at the end of the array.  
This behavior is specified in the [ECMAScript specification](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.11).

```javascript
[{ id: 3 }, { id: 1 }, { id: undefined }, { id: 7 }].sort(comparing({ key: 'id', specials: [[undefined, 'first']] }))
// => [{ id: undefined }, { id: 1 }, { id: 3 }, { id: 7 }]
// It's OK.

[3, 1, null, 7].sort(comparing({ specials: [[null, 'first']] }))
// => [null, 1, 3, 7]
// It's OK.

[3, 1, undefined, 7].sort(comparing({ specials: [[undefined, 'first']] }))
// => [1, 3, 7, undefined]
// The expected result is [undefined, 1, 3, 7] but `undefined` is always placed at the end...
```


## Similar modules

* [compare-func](https://www.npmjs.com/package/compare-func)
* [default-compare](https://www.npmjs.com/package/default-compare)
* [comparators](https://www.npmjs.com/package/comparators)

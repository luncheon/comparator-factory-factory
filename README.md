# compare-by

Create a comparison function to be used for sorting arrays.


## Usage & Examples

```javascript
import compareBy from 'compare-by';
// const compareBy = require('compare-by');

['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(compareBy());
// => [null, 'A1', 'A10', 'A3', 'A5', 'A7']

['A5', 'A1', null, 'A3', 'A10', 'A7'].sort(compareBy({ nulls: 'last', collator: { numeric: true } }));
// => ['A1', 'A3', 'A5', 'A7', 'A10', null]

const users = [
  { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
  { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
  { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
  { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
  { id: '05', name: 'bob',     profile: { age: 18 } },
  { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
];

users.sort(compareBy('profile.age', 'id'));
// => [
//  { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
//  { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
//  { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
//  { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
//  { id: '05', name: 'bob',     profile: { age: 18 } },
//  { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
// ]

users.sort(compareBy(({ name }) => name, 'id'));
// => [
//  { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
//  { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
//  { id: '05', name: 'bob',     profile: { age: 18 } },
//  { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
//  { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
//  { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
// ]

users.sort(compareBy(
  { key: 'name', desc: true, nulls: 'first', collator: { caseFirst: 'false' } },
  { key: ['profile.age', 'tels.0'], nulls: 'max' },
  'id',
));
// => [
//  { id: '03',                  profile: { age: 16 }, tels: ['05-0000-0000', '05-0000-0001'] },
//  { id: '04', name: 'Charlie', profile: { age: 15 }, tels: ['03-0000-0000'] },
//  { id: '06', name: 'Bob',     profile: { age: 18 }, tels: ['06-0000-0000'] },
//  { id: '02', name: 'Bob'                          , tels: ['02-0000-0000'] },
//  { id: '05', name: 'bob',     profile: { age: 18 } },
//  { id: '01', name: 'Alice',   profile: { age: 17 }, tels: ['04-0000-0000'] },
// ]
```


## API

compareBy(...orderSpecs) => (a, b) => (-1 | 0 | 1)

<!-- CollatorOptions
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Collator -->

## Limitation

If the element itself of the array is `undefined`, `Array.prototype.sort()` always put the element at the end of the array.  
This behavior is specified in the [ECMAScript specification](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.11).

```javascript
console.log([undefined, null, ''].sort(compareBy({ nulls: 'first' })))  // [null, '', undefined]
console.log([undefined, null, ''].sort(compareBy({ nulls: 'last' })))   // ['', null, undefined]
```


## Similar libraries (haven't satisfied my requirements)

* [compare-func](https://www.npmjs.com/package/compare-func)
* [default-compare](https://www.npmjs.com/package/default-compare)
* [comparators](https://www.npmjs.com/package/comparators)

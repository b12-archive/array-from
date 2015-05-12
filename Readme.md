[![Coveralls – test coverage
](https://img.shields.io/coveralls/studio-b12/array-from.svg?style=flat-square)
](https://coveralls.io/r/studio-b12/array-from)
 [![Travis – build status
](https://img.shields.io/travis/studio-b12/array-from/master.svg?style=flat-square)
](https://travis-ci.org/studio-b12/array-from)
 [![David – status of dependencies
](https://img.shields.io/david/studio-b12/array-from.svg?style=flat-square)
](https://david-dm.org/studio-b12/array-from)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)
](https://github.com/airbnb/javascript)




array-from
==========

**A ponyfill for the ES 2015 (ES6) [`Array.from()`][].**

**Ponyfill: A polyfill that doesn't overwrite the native method.**

Credits for the implementation go to the amazing guys of the MDN. [See the original here][].

[`Array.from()`]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from                  "Array.from()"
[See the original here]:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from$revision/727125  "Array.from()"




Installation
------------

```sh
$ npm install array-from
```




Usage
-----

Recommended:

```js
var arrayFrom = require('array-from');
  // You’ll get the native `Array.from` if it’s available.

function () {console.log(
  arrayFrom(arguments).map(require('1-liners/increment'))
);}(1, 2, 3);
//» [2, 3, 4]
```

[Not recommended][], but possible:

```js
if (!Array.from) Array.from = require('array-from');
  // This will affect all loaded modules.

function () {console.log(
  Array.from(arguments).map(require('1-liners/increment'))
);}(1, 2, 3);
//» [2, 3, 4]
```

[Not recommended]:  https://github.com/sindresorhus/object-assign/issues/10#issuecomment-65065859  "Optionally shim native method?"




License
-------

[MIT][] © [Studio B12 GmbH][]

[MIT]: ./License.md
[Studio B12 GmbH]: https://github.com/studio-b12

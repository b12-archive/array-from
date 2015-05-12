var test = require('tape-catch');
var plus = require('1-liners/plus');

var arrayFrom = require('./index');

test('Works as expected', function(is) {
  var mock = {0: 'a', 1: 'b', 2: 'c', length: 3};

  is.deepEqual(
    arrayFrom(mock),
    ['a', 'b', 'c'],
    'with a mock object'
  );

  is.ok(
    arrayFrom(mock) instanceof Array,
    '– returning an array'
  );

  is.deepEqual(
    (function() {return arrayFrom(arguments);})('a', 'b', 'c'),
    ['a', 'b', 'c'],
    'with the `arguments` object'
  );

  is.deepEqual(
    arrayFrom(['a', 'b', 'c']),
    ['a', 'b', 'c'],
    'with an array'
  );

  is.deepEqual(
    arrayFrom(mock, plus),
    ['a0', 'b1', 'c2'],
    'when dealing with `mapFn`'
  );

  var context = {suffix: '+'};
  is.deepEqual(
    arrayFrom(mock,
      function(item) {return (item + this.suffix);},
      context
    ),
    ['a+', 'b+', 'c+'],
    'when dealing with `mapFn` and `thisArg`'
  );

  is.end();
});

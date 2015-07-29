var test = require('tape-catch');
var plus = require('1-liners/plus');

require('core-js/es6/symbol');// Polyfill Symbol.iterator into global namespace
var set = require('core-js/library/fn/set');

var arrayFrom = require('./arrayFrom');

test('Works as expected', function(is) {
  var mock = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
  };

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
    arrayFrom({
      0: 'a',
      1: 'b',
      2: 'c',
      'a': 'left out',
      '-1': 'left out',
      length: 3,
    }),
    ['a', 'b', 'c'],
    '– ignoring illegal indices'
  );

  is.deepEqual(
    arrayFrom({}),
    [],
    'with an empty object'
  );

  is.deepEqual(
    arrayFrom([]),
    [],
    'with an empty array'
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
  
  is.deepEqual(
    arrayFrom(new set(['a', 'b', 'c'])),
    ['a', 'b', 'c'],
    'when using iterable objects'
  );

  is.deepEqual(
    arrayFrom(new set(['a', 'b', 'c']).keys(), plus),
    ['a0', 'b1', 'c2'],
    'when dealing with iterables and `mapFn`'
  );
  
  is.deepEqual(
    arrayFrom(new set(['a', 'b', 'c']).values(),
      function(item) {return (item + this.suffix);},
      context
    ),
    ['a+', 'b+', 'c+'],
    'when dealing with iterables, `mapFn`, and `thisArg`'
  );

  var geckoIterator = {
    "@@iterator" : function(){
      return {
        next: function(){ return { done: true } }
      }
    }
  }

  is.deepEqual(
    arrayFrom(geckoIterator),
    [],
    'when using Gecko-based "@@iterator" property.'
  );

  var Transferable = function(){}
  Transferable.from = arrayFrom;

  is.ok(
    Transferable.from([1]) instanceof Transferable,
    'can be transfered to other constructor functions'
  );

  is.equal(
    Transferable.from(new set(['a', 'b', 'c'])).length, 3,
    'can be transfered to other constructor functions (iterable)'
  );

  is.end();
});

test('Throws when things go very wrong.', function(is) {
  is.throws(
    function() {
      arrayFrom();
    },
    TypeError,
    'when the given object is invalid'
  );

  is.throws(
    function() {
      arrayFrom({length: 0}, /invalid/);
    },
    TypeError,
    'when `mapFn` is invalid'
  );

  
  var invalidIterator = {};
  invalidIterator[Symbol.iterator] = {};

  is.throws(
    function() {
      arrayFrom(invalidIterator);
    },
    TypeError,
    'when an iterable has an invalid iterator property'
  );

  var noIterator = {};
  noIterator[Symbol.iterator] = function(){};

  is.throws(
    function() {
      arrayFrom(noIterator);
    },
    TypeError,
    '– no iterator returned');

  var noNext = {};
  noNext[Symbol.iterator] = function(){return {}};

  is.throws(
    function() {
      arrayFrom(noNext);
    },
    TypeError,
    '– no `next` function'
  );

  is.end();
});

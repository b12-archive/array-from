// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
module.exports = (
  typeof Array.from === 'function' ?
  Array.from :
  (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    var isIterable = function (value) {
      return (typeof Symbol !== 'undefined') && ('iterator' in Symbol) && (Symbol.iterator in value);
    };
    var getIterator = function (value) {
      return value[Symbol.iterator]();
    };

    // The length property of the from method is 1.
    return function from(items/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. If mapfn is undefined, let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;

      var T;
      if (typeof mapFn !== 'undefined') {
        // 3. else
        // 3. a. If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 3. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
        // 3. c. Let mapping be true (implied by mapFn)
      }

      var A, k;

      // 4. Let usingIterator be IsIterable(items).
      // 5. ReturnIfAbrupt(usingIterator).
      var usingIterator = isIterable(items);

      // 6. If usingIterator is not undefined, then
      if(usingIterator) {
        // a. If IsConstructor(C) is true, then
        //   i. Let A be the result of calling the [[Construct]] internal method of C with an empty argument list.
        // ￼￼￼￼￼￼￼￼￼￼￼￼b. Else,
        //   ￼￼i. Let A be the result of the abstract operation ArrayCreate with argument 0.
        // c. ReturnIfAbrupt(A).
        A = isCallable(C) ? Object(new C()) : [];

        // d. Let iterator be GetIterator(items, usingIterator).
        var iterator = getIterator(items);

        // e. ReturnIfAbrupt(iterator).
        if(iterator == null) {
          throw new TypeError("Array.from requires an array-like or iterable object");
        }

        // f. Let k be 0.
        k = 0;

        // g. Repeat
        var next, nextValue;
        while(true) {
          // i. Let Pk be ToString(k).
          // ii. Let next be IteratorStep(iterator).
          // iii. ReturnIfAbrupt(next).
          next = iterator.next();

          // ￼iv. If next is false, then
          if(!next || next.done) {

            // 1. Let setStatus be Set(A, "length", k, true).
            // 2. ReturnIfAbrupt(setStatus).
            A.length = k;

            // 3. Return A.
            return A;
          }

          // v. Let nextValue be IteratorValue(next).
          // vi. ReturnIfAbrupt(nextValue)
          nextValue = next.value;

          // vii. If mapping is true, then
          //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
          //   2. If mappedValue is an abrupt completion, return IteratorClose(iterator, mappedValue).
          //   3. Let mappedValue be mappedValue.[[value]].
          // viii. Else, let mappedValue be nextValue.
          // ix. Let defineStatus be the result of CreateDataPropertyOrThrow(A, Pk, mappedValue).
          // x. [TODO] If defineStatus is an abrupt completion, return IteratorClose(iterator, defineStatus).
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(nextValue, k) : mapFn.call(T, nextValue, k);
          } else {
            A[k] = nextValue;
          }
          // xi. Increase k by 1.
          k++;
        }
      // 7. Assert: items is not an Iterable so assume it is an array-like object.
      } else {
        // 8. Let arrayLike be ToObject(items).
        var arrayLike = Object(items);
  
        // 9. ReturnIfAbrupt(items).
        if (items == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }

        // 10. Let len be ToLength(Get(arrayLike, "length")).
        // 11. ReturnIfAbrupt(len).
        var len = toLength(arrayLike.length);

        // 12. If IsConstructor(C) is true, then
        //     a. Let A be Construct(C, «len»).
        // 13. Else
        //     a. Let A be ArrayCreate(len).
        // 14. ReturnIfAbrupt(A).
        A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 15. Let k be 0.
        k = 0;
        // 16. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = arrayLike[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 17. Let setStatus be Set(A, "length", len, true).
        // 18. ReturnIfAbrupt(setStatus).
        A.length = len;
        // 19. Return A.
      }
      return A;
    }
  })()
);

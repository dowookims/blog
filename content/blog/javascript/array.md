---
title: JAVASCIPRT Array에 대해 알아보자
date: "2020-09-02"
tags: [javascript]
description: "Array는 어떻게 생겨먹은 녀석일까?"
thumbnail: ./imgs/array.png
---

[velog.io](https://velog.io)를 둘러보다가 [배열에 비동기 작업을 실시할 때 알아두면 좋은 이야기들](https://velog.io/@hanameee/%EB%B0%B0%EC%97%B4%EC%97%90-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%9E%91%EC%97%85%EC%9D%84-%EC%8B%A4%EC%8B%9C%ED%95%A0-%EB%95%8C-%EC%95%8C%EC%95%84%EB%91%90%EB%A9%B4-%EC%A2%8B%EC%9D%84%EB%B2%95%ED%95%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0%EB%93%A4)이라는 게시글을 봤습니다.

여기서 나온 첫번째 문제를 해결할 방법을 고민해 봤는데, 마땅한 방법이 생각나지 않았는데... 이런 이슈가 있었습니다.

알고 쓰자고 생각하고 있으나, 여전히 모르는 내용들이 많기 때문에 이 기회에 자바스크립트 Array에 대해 알아보려고 합니다.

## Intro

> Javascript `Array` 전역 객체는 배열을 생성할 때 사용하는 `리스트` 형태의 고수준 객체이다.
> Array는 프로토타입으로 탐색, 변형 작업을 수행하는 메서드를 갖는, `리스트와 비슷한` 객체이다.

MDN에서 나온 자바스크립트 Array의 정의는 다음과 같습니다. 그리고 자바스크립트 배열에서 독특한 특징들이 있었는데 이를 정리해 보려고 합니다.

### length

Array 속성은 length property를 가지며, Array의 요소의 개수를 나타냅니다.

Array의 내장 메서드 (join, slice, indexOf 등은) 호출했을 때 배열의 `length` 속성 값을 참조하며, `push`, `splice`는 Array의 `length` 속성의 값을 업데이트 합니다.

이 `length` 를 이용하여 아래와 같이 Array를 조작 할 수 있는데,

```js
const arr = []
arr.length = 10
console.log(arr) // [empty x 10];
arr[15] = "a"
console.log(arr) // [empty x 15, 'a']
arr.length = 8
console.log(arr) // [empty x 8]
```

이처럼 Array를 length property로 조작 할 수도 있습니다.

### Static method

#### Array.from()

> Array.from(arrayLike, mapFn: Optional, thisArg: Optional)  
> arrayLike : 유사 배열, iterable 객체
> mapFn : 배열의 모든 요소에 대해 호출할 맵핑 함수
> thisArg : mapFn 실행 시 this로 사용할 값
> return : 새로운 Array Instance

이 메서드는 유사 배열 객체나 반복 가능한 객체를 얕게 복사해 새로운 Array 객체를 만듭니다.

```js
Array.from("douglas")
// ["d", "o", "u", "g", "l", "a", "s"]

const s = new Set(["dowoo", "kim"])
Array.from(s)
// ['dowoo', 'kim']

const m = new Map([
  [1, 2],
  [2, 4],
  [4, 8],
])
Array.from(m)
// [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([
  ["1", "a"],
  ["2", "b"],
])
Array.from(mapper.values())
// ['a', 'b'];

Array.from(mapper.keys())
// ['1', '2'];

function f() {
  return Array.from(arguments)
}

f(1, 2, 3)
// [1, 2, 3]
```

이 메서드를 활용해 시퀀스 생성기도 만들 수 있습니다.

```js
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

// Generate numbers range 0..4
range(0, 4, 1)
// [0, 1, 2, 3, 4]

// Generate numbers range 1..10 with step of 2
range(1, 10, 2)
// [1, 3, 5, 7, 9]

// Generate the alphabet using Array.from making use of it being ordered as a sequence
range("A".charCodeAt(0), "Z".charCodeAt(0), 1).map(x => String.fromCharCode(x))
// ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```

`Array.from` 은 ECMA-262 표준 제6판에 추가 되었기에, 이를 지원하지 않는 브라우저`(IE) - IE11도 지원하지 않음`도 있습니다. 아래 코드를 포함하면 지원하지 않는 플랫폼에서도 `Array.from` 을사용할 수 있습니다. 아래 알고리즘은 `Object` 와 `TypeError` 가 변형되지 않고, `callback.call` 의 계산 값이 원래의 `Function.prototype.call()` 과 같은 경우 `ECMA-262 제6판` 이 명시한 것과 동일합니다.또한 반복가능자(iterable)는 완벽하게 폴리필할 수없기에 본 구현은 ECMA-262 제6판의 제네릭 반복가능자를 지원하지 않습니다.
이 함수의 폴리필은 다음과 같습니다.

````js
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
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

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

갑자기 문뜩 든 생각이, array를 deep copy할 때 어떤게 효율이 가장 좋을까 생각을 해 보았습니다.

테스트 코드는 다음과 같습니다.

```js
const arr = Array(10000).fill(Array(10000).fill(0));

console.time('from');
const w = Array.from(arr, arr => Array.from(arr));
console.timeEnd('from')

console.time('json');
const q = JSON.parse(JSON.stringify(arr));
console.timeEnd('json');

console.time('spread');
const s = arr.map(v => [...v]);
console.timeEnd('spread');

console.time('map');
const e = arr.map(v => {v.map(t => t)});
console.timeEnd('map');

const arr2 = [];
console.time('forpush');
for (let i=0; i<10000; i++) {
    arr.push([]);
    for (let j =0; j < 10000; j++) {
        arr[i].push(0);
    }
}
console.timeEnd('forpush')

// from: 1141.065ms
// json: 5399.943ms
// spread: 1373.498ms
// map: 1466.990ms
// forpush: 2653.858ms
````

실험 결과, `JSON.parse()`, `JSON.stringify()` 가 가장 오래 걸렸으며, from이 가장 적게 걸렸다.
그리고, 테스트를 돌리던 중 확인한게, map과 spread 문법을 활용한 로직의 경우 heap 메모리를 겁나 잡아먹어 에러를 내뿜는 것을 확인 할 수 있었습니다. 이에 대한 이슈를 한번 확인 해 봐야겠습니다.

#### Array.isArray()

> Array.isArray(obj)  
> obj: Object
> return : Boolean

Array 객체를 판별할 때, `Array.isArray()` 는 `iframe`을 통해서도 작동하기 때문에 `instanceOf` 보다 적합합니다.

##### 폴리필

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]"
  }
}
```

#### Array.of()

> Array.of(element0[, element1[, ...[, elementN]]])  
> elementN : 배열 생성할 때 사용할 요소  
> return : Array

```js
Array.of(1) // [1]
Array.of(1, 2, 3) // [1, 2, 3]
Array.of(undefined) // [undefined]
```

##### 폴리필

```js
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments)
  }
}
```

### Instance Method

#### Array.prototype.sort()

`sort()` 메서드는 배열의 요소를 정렬 후, 정렬된 배열을 반환하며, 정렬은 `stable sort`가 아닐 수 있습니다.

기본 정렬 순서는 문자열의 유니코드 코드 포인트를 따르며, 정렬 속도와 복잡도는 구현 방식에 따라 다를 수 있습니다.

> 만약 const arr = [9, 80]일때 arr.sort() 를 하게 되면 반환값으로 [80, 9]를 얻게 된다

> arr.sort([compareFunction])  
> compareFunction : 정렬 순서를 정의하는 함수. 생략하면 배열은 각 요소를 문자열 변환(String으로 casting)후 문자의 유니 코드 코드 포인트 값에 따라 정렬됩니다.  
> return : sort된 원 배열

`compareFunction`이 제공되면 배열 요소는 compare 함수의 반환 값에 따라 정렬됩니다. a, b가 비교되는 두 요소라면

- `compareFunction(a, b)` 의 return 값이 0보다 작은 경우, a를 b보다 낮은 값으로 판단되어 a가 b보다 먼저 오게 됩니다.
- `compareFunction(a, b)` 의 return 값이 0일 경우, 서로 변경하지 않고, 모든 다른 요소에 정렬
- `compareFunction(a, b)` 의 return 값이 0보다 큰 경우, b를 a보다 낮은 index로 정렬
- `compareFunction(a, b)`의 요소 a와 b의 특정 쌍이 두 개의 인수로 주어질 때 항상 동일한 값을 반환해야합니다. 일치하지 않는 결과가 반환되면 정렬 순서는 정의되지 않습니다.

> 비ASCII 문자일 경우, String.localeCompare를 활용합니다.

#### Array.prototype.splice()

`splice()`메서드는 배열의 기존 요소를 삭제 또는 교체하거나, 새 요소를 추가하여 배열의 내용을 변경합니다.

> array.splice(start, deleteCount, ...items)  
> start: Number => 배열의 변경을 시작할 인덱스. 배열의 길이보다 클 경우 배열의 길이로 설정되며, 음수인 경우 -n 일때, `array.length -n`  
> deleteCount: Number? => 배열에서 제거할 요소의 수. 생략하거나, `array.length - start` 보다 클 경우 모든 요소를 제거하며, 0이하 일 경우 아무것도 제거하지 않습니다.  
>  items: Any? => 배열에 추가할 요소. 아무 요소도 지정하지 않으면 요소를 제거만 합니다.  
> return: 제거한 요소를 담은 배열

#### Array.prototype.slice()

`slice()` 메서드는 배열의 `begin`부터 `end`까지(end 미포함)에 대한 얕은 복사본을 새로운 배열 객체로 반환하며, 원본은 변하지 않습니다.

> array.slice(begin, end?)  
> begin: Number? 배열 복사의 시작점. default: 0
> end: Number? 배열 복사의 종료점. default: array.length  
> return: Array => 추출한 요소를 포함한 새로운 배열

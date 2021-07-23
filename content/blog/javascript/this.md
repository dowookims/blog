---
title: JAVASCIPRT THIS에 대해 알아보자
date: "2020-09-07"
tags: [javascript]
description: "THIS is this that is that"
thumbnail: ./imgs/this.png
---

자바스크립트가 아닌 다른 대부분의 객체지향 언어에서 this는 클래스로 생성한 인스턴스 객체를 의미합니다. 그러나 자바스크립트에서 this는 어디서든 사용할 수 있습니다.

자바스크립트에서 this는 상황에 따라 바라보는 대상이 달라집니다. 함수와 객체(메서드)의 구분이 느슨한 자바스크립트에서 `this`는 실질적으로 함수와 메서드를 구분하는 거의 유일한 기능이며, this의 동작 방식을 이해하지 않고 작업을 할 경우 참조 되는 `this`가 의도한 `this`와 달라 많이 헤메일 수 있습니다.

## 상황에 따라 달라지는 this

자바스크립트에서 this는 기본적으로 실행 컨텍스트가 생성될 때 함께 결정됩니다. Context가 생성 될때 같이 생성되는 것들이

- VariableEnvironment
- LexicalEnvironment
- ThisBinding

에서 this도 Context가 생성될 때 결정이 됩니다. 실행 컨텍스트는 함수를 호출할 때 생성되므로, 이는 즉 this는 `함수를 호출할 때 결정된다`라고 말할 수 있습니다. 그렇기에 함수를 <u>어떤 방식</u>으로 호출하는지에 따라 값이 달라지기에, 개발할 때 함수의 호출 시점을 유심히 봐야 합니다.

### 전역 공간에서 this

전역 공간에서 this는 전역 객체를 가리킵니다. 개념상 전역 컨텍스트를 생성하는 주체가 전역 객체이기 때문입니다. 전역 객체는 자바스크립트 런타임에 따라 브라우저 환경에서는 `Window`, 노드 환경에서는 `Global` 입니다.

전역변수를 선언하면 JS 엔진은 전역 변수를 전역 객체의 프로퍼티로도 할당합니다.

```js
var a = 5
let b = 3
const c = 1

console.log(window.a) // 5
console.log(window.b) // undefined
console.log(window.c) // undefined
```

저는 이제 `var` 를 아예 안쓰고 `let`과 `const`로 작업을 진행하다 보니 전역변수로 설정 되지는 않는데 왜 `let`과 `const`는 전역 변수로 등록되지 않을까요?

이를 자세히 알아보기 위해 검색 했을 때, 다음과 같은 글을 볼 수 있었습니다. [A javascript 'let' global variable is not a property of 'window' unlike a global 'var'](https://stackoverflow.com/questions/39414692/a-javascript-let-global-variable-is-not-a-property-of-window-unlike-a-global)

함께 보기 좋은 글인거 같아 하나 더 첨부합니다. [JavaScript Variables Lifecycle: Why let Is Not Hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)

결론적으로 이야기 하자면, `let, const` 의 경우 `global environment`의 `declarative environment record`에는 저장이 되지만, `object environment record`에는 저장이 되지 않기 때문에 `window` 객체의 프로퍼티로 접근 할 수 없게 됩니다.

### 메서드 호출할 때 메서드 내부에서의 this

#### 함수 vs 메서드

함수를 실행하는 여러 가지 방법 중, 가장 일반적인 두가지 방법은 함수로서 호출과 메서드로서 호출하는 것 입니다. 메서드와 함수 호출을 구분할 수 있는 가장 눈에띄는 구분자는 `독립성` 입니다. 함수는 자체로 독립적인 기능을 수행하는 반면에 메서드는 자신을 호출한 대상 객체에 관한 동작을 수행합니다. 자바스크립트는 상황별로 `this` 키워드에 다른 값을 부여하게 함으로써 이를 구현하였습니다.

자바스크립트에서 메서드를 `객체의 프로퍼티에 할당된 함수`라고 이해할 수도 있는데 자바스크립트에서는 객체의 메서드로 호출할 경우에만 메서드로 동작하고, 그렇지 않으면 함수로 동작하게 됩니다.

```js
let letA = 52
var varA = 23
const conA = 57

var func1 = function() {
  console.log(this.letA, this.varA, this.conA)
}

var obj = {
  letA: 12,
  varA: 13,
  conA: 15,
  met: func1,
}

func1()
obj.met()
```

해당 함수의 콘솔을 브라우저에서 확인하면

`undefined 23 undefined`  
`12, 13, 15`  
라는 값이 나옵니다. 하지만 노드에서는

`undefined undefined undefined`  
`12, 13, 15`  
이 나오며, node에서는 전역 변수로 등록을 하려면 `global.property`로 등록해야 사용이 가능합니다.

여담이 길었는데, 결국 함수를 호출 할 때 `함수로서 호출`과 `메서드로서 호출`시에 `this`가 달라지는 것을 확인 했습니다. 이 `함수로서 호출`과 `메서드로서 호출`을 구분하는 방법은, 함수 앞에 `.`이 있는지의 여부입니다. 메서드로서 호출된 함수의 경우 참조하는 `this`는 호출된 메서드 바로 앞에, `.` 앞에 놓여져있는 객체 입니다.

함수로서 호출할 경우에는 `this`가 지정이 되지 않습니다. 그러나 `this`에는 함수를 호출한 주체에 대한 정보가 담기게 됩니다. 함수로 호출하는 것은 호출 주체(OOP에서의 객체)를 명시하지 않고 개발자가 코드에 직접 관여해 실행한 것이기에 호출 주체의 정보를 알 수 없습니다. 이런 경우 `this`는 전역 객체를 바라봅니다.

#### 메서드 내부함수에서의 this

메서드에서 내부 함수를 정의하고, 이 함수에서 `this` 키워드를 사용하여도 이 `this`는 전역객체를 가리키게 됩니다.

```js
var obj1 = {
  outer: function() {
    console.log(this)
    var innerFunc = function() {
      console.log(this)
    }
    innerFunc()

    var obj2 = {
      innerMethod: innerFunc,
    }
    obj2.innerMethod()
  },
}
obj1.outer()
// obj1, Window, obj2.innerMethod 순으로 this가 참조됩니다.
```

이렇게 구분하면, this에 대해 명확하게 구분을 할 수 있지만, 우리가 의도한 대로 작업한게 아니게 됩니다. 만약 개발할 때 저렇게 this를 사용한다면 전역 객체 `this`에 접근하려는게 아니라 자연스럽게, 문맥적으로 가장 가까운 주변 환경의 `this`를 그대로 상속받아 작업 할 수 있을 것이라 생각하고 개발 할 것입니다. 마치 변수의 스코프를 탐색하는 것과 마찬가지로요.

이 문제를 해결하기 위해 기존 자바스크립트 개발자들이 사용하는 방법은 다음과 같습니다.

```js
var obj1 = {
  outer: function() {
    console.log(this)
    var innerFunc = function() {
      console.log(this)
    }
    innerFunc()

    var self = this // 객체의 this의 참조값을 변수로 저장하여, 이 변수를 건내주는 것 입니다.
    var innerFunc2 = function() {
      console.log(self)
    }
    innerFunc2()
  },
}
obj1.outer()
```

이렇게, 상위 스코프에 있는 this를 변수에 저장해서, 이 변수를 사용하는 방법으로 해결했습니다.

ES6에서는 더 깔끔하게 이 문제를 해결했는데요, 저도 주로 이 방법을 사용합니다.

```js
const obj = {
  outer: function() {
    console.log(this)
    const innerFunc = () => {
      console.log(this)
    }
  },
}
```

그 밖에도, `call, apply, bind`라는 친구들이 존재합니다.

#### 콜백함수에서 this

콜백함수에서의 `this`는 명확히 `this`는 이거다! 라고 지정할 수 없습니다. 콜백함수의 제어권을 가지는 함수 또는 메서드가 콜백 함수에서 `this`를 무엇을 할지 결정하며, 특별히 정의하지 않은 경우 기본 함수와 마찬가지로 전역 객체를 가리키게 됩니다.

```js
setTimeout(function() {
  console.log(this)
}, 300) // window
;[1, 2, 3, 4, 5].forEach(function(x) {
  console.log(this)
}) // window
document.body.querySelector("div").addEventListenr("click", function(e) {
  console.log(this)
}) // div 엘리먼트
```

위에서 `addEventListener` 의 경우 지정한 `HTML element`에 해당 이벤트('click')이 발생할 때마다 콜백 함수의 첫번째 인자로 이벤트 정보를 담아 함수를 실행하며, this를 해당 이벤트를 일으킨 엘리먼트에 binding 합니다.

#### 생성자 함수에서의 this

생성자 함수에서의 `this`는 `new` 키워드로 생성자 함수를 사용할 때 만들어지는 인스턴스를 의미합니다.

## 명시적 this binding

### Function.prototype.call(thisArg, args...)

call 메서드는 메서드의 호출 주체인 함수를 즉시 실행되도록 하는 명령어 입니다. call의 첫 번째 인자를 `this`로 바인딩하고, 이후 인자들을 호출할 함수의 매개변수로 합니다.

```js
var nodeList = document.querySelectorAll("div") // div 노드의 유사 배열이 저장이 됩니다.
// 유사 배열은 배열 메서드를 사용할 수 없지만, length값과 정수의 index, iterable이 가능합니다.
// 여기서 배열의 메서드를 사용하기 위해 다음과 같이 사용합니다.

Array.prototype.forEach.call(nodeList, function(v) {
  console.log(v)
})
```

### Function.prototype.apply(thisArgs, [...])

apply 메서드는 call 메서드와 기능적으로 동일하나, 두 번째 인자로 배열을 받아 그 배열의 요소들을 호출할 함수의 매개변수로 지정한다는 점에서 차이가 있습니다.

### 객체의 상속 구현시

생성자 내부에 다른 생성자와 공통된 내용이 있을 경우 call 또는 apply를 이용해 다른 생성자를 호출하여 반복을 줄일 수 있습니다.

```js
function Person(name, gender) {
  this.name = name
  this.gender = gender
}

function Student(name, gender, age) {
  Person.call(this, name, gender)
  this.age = age
}
```

### Function.prototype.bind(thisArg, ...arg)

call과 비슷하지만 즉시 호출하지 않고, 넘겨 받은 this와 인수들을 바탕으로 새로운 함수를 반환하는 메서드 입니다.

### Arrow function

화살표 함수는 실행 컨텍스트 생성 시 this를 바인딩 하는 과정이 제외되었으며, 함수 내부에 this가 아예 없고 접근하려고 하면 스코프체인상 갖아 가까운 this에 접근합니다.

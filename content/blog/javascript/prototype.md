---
title: JAVASCIPRT Prototype에 대해 알아보자
date: "2020-09-09"
tags: [javascript]
description: "Prototype에 대해 알아보는 시간을 가지도록 하도록 하도록 합시다."
thumbnail: ./imgs/prototype.png
---

자바스크립트는 프로토타입 기반 언어입니다. 프로토타입 기반 언어에서는 어떤 객체를 원형(prototype)으로 삼고 이륿 ㅗㄱ제 함으로써 상속과 비슷한 효과를 얻습니다.

## 프로토타입의 개념 이해

```js
const instance = new Constructor()
```

### **proto**

- 어떤 생성자 함수를 new 연산자와 함께 호출하면
- Constructor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성됩니다
- 이때 instance에는 `__proto__`라는 프로퍼티가 자동으로 부여되는데
- 이 프로퍼티는 Constructor의 prototype이라는 프로퍼티를 참조합니다.

prototype은 객체이고, 이를 참조하는 **proto**또한 객체입니다. prototype 객체 내부에는 인스턴스가 사용할 메서드를 저장합니다. 그러면 **proto** 또한 prototype을 참조하고 있기 때문에 이를 통해 메서드들에 접할 수 있게 됩니다.

예를 들어, Person이라는 생성자 함수의 prototype에 getName이라는 메서드를 지정한다면

```js
const Person = function(name) {
  this._name = name
}

Person.prototype.getName = function() {
  return this._name
}
```

이렇게 되면 Person instance는 **proto**를 통해 getName을 호출 할 수 있습니다.

하지만 여기서 재미있는 부분이 발견되는데요,

```js
const douglasK = new Person("dowookim")
douglasK.__proto__.getName() // undefined
```

Person 생성자로 만든 인스턴스에서, `__proto__`로 접근해 `getName`을 호출 했을 때 `undefined`라는 값을 확인할 수 있습니다.  
`undefined`가 나왔다는 것은, getName은 호출 가능한 함수였다는 건데, 왜 이렇게 되었을 까요? 그 이유는 아마 `this`의 문제일 것이라 생각이 듭니다. 메서드의 `this`는 메서드 앞에 있는 객체를 의미하고, 이 `__proto__`에서는 `name`이라는 property가 없기 때문입니다.

그렇기에, prototype에 의해 정의한 메서드의 경우 `__proto__`로 직접 접근해 호출 하는 것이 아니라, `인스턴스.메서드()`로 호출하는게 바람직합니다. 자바스크립트는 설계상, `__proto__`를 생성해 놓는데, 해당 함수를 생성자 함수로서 사용할 경우, 즉 new 연산자와 함께 함수를 호출할 경우 그로부터 생성된 인스턴스에는 숨겨진 프로퍼티인 **proto**가 자동적으로 생성되며 이 프로퍼티는 생성자 함수의 prototype 프로퍼티를 참조합니다.

**proto** 프로퍼티는 생력 가능하도록 구현돼 있기 때문에, 생성자 함수의 prototype에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 자신의 것처럼 해당 메서드나 프로퍼티에 접근할 수 있게 됩니다.

### constructor

생성자 함수의 프로퍼티인 prototype 내부에는 constructor라는 프로퍼티가 있습니다. 인스턴스의 **proto** 객체 내부에도 마찬가지 입니다. 이 프로퍼티는 원래의 생성자 함수(자기 자신)을 참조합니다. 이는 인스턴스로부터 그 원형이 무엇인지 알 수 있는 수단이 됩니다.

## 프로토타입 체인

### 메서드 오버라이드

```js
const Person = function(name) {
  this.name = name
}

Person.prototype.getName = function() {
  return this.name
}

const me = new Person("douglasK")
me.getName = function() {
  return "dowoo -" + this.name
}
me.getName() // 'dowoo - douglasK'
```

메서드 위에 메서드를 덮어씌웠기에 이를 메서드 오버라이딩 이라고 합니다. 이는 원본을 제거하고 다른 대상으로 체하는 것이 아니라 스코프 체이닝처럼 원본이 그대로 있는 상태에서 다른 대상을 그 위에 얹는 이미지를 떠올리면 좋습니다.

자바스크립트 엔진이 getName이라는 메서드를 찾는 방식은 가장 가까운 대상인 자신의 프로퍼티를 검색하고, 없으면 그다음 가까운 대상인 **proto** 를 검색하는 순서로 진행됩니다. 그렇기에 Person.prototype.getName에 접근 하는 순서가 me.getName에 접근하는 것보다 밀리게 됩니다.

이렇게, 어떤 객체에서 **proto** 프로퍼티 내부에 다시 **proto** 프로퍼티가 연쇄적으로 이어진 것을 프로토타입 체인이라 하고 이 체인을 따라가며 검색하는 것을 프로토타입 체이닝 이라고 합니다.

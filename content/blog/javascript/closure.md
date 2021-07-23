---
title: JAVASCIPRT Closure에 대해 알아보자
date: "2020-09-09"
tags: [javascript]
description: "Closure에 대해 arabodorok haza"
thumbnail: ./imgs/closure.png
---

## 클로저에 대하여

클로저는 여러 함수형 프로그래밍 언어에서 등장하는 보편적인 특성입니다. 클로저에 대한 설명은 다양하나, MDN에서는 `클로저는 함수와 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상` 이라고 합니다.

선언할 당시의 lexical environment는 `outerEnvironmentReference`에 해당합니다. `lexicalEnvironment`의 `environmentRecord`와 `outerEnvironmentReference`에 의해 변수의 요휴범위인 스코프가 결정되고, 스코프 체인이 가능해 집니다. 컨텍스트 A에서 선언한 내부 함수의 실행 컨텍스트는 활성화된 시점에서 A의 컨텍스트에 접근이 가능한 것처럼, 내부함수에서 외부 변수를 참조하는 경우에 한해서 `선언될 당시의 lexicalEnvironment와의 상호관계`가 의미있다고 볼 수 있습니다.

```js
const outer = function () {
    let a = 1;
    const inner = function() {
        console.log(++a);
    };
    return inner
};

const q = outer();
q(); // 2
q(); // 3
console.log(a) // a is not defined;
};
```

```js
var a = 1
const outer = function() {
  var a = 2
  const inner = function() {
    console.log(++a)
  }
  return inner
}

const q = outer()
q() // 3
q() // 4
console.log(a) // 1
```

```js
var a = 1
const outer = function() {
  a = 2
  const inner = function() {
    console.log(++a)
  }
  return inner
}

const q = outer()
q() // 3
q() // 4
console.log(a) // 4
```

위에서 outer 함수를 정의했고, outer 함수 내부에 a라는 변수가 있습니다. 그리고 outer 함수에 inner라는 내부 함수를 정의했는데, 이 inner는 1 증가된 a를 콘솔에 찍습니다. 이후 `outer`는 내부함수인 `inner`를 반환하는데요, 이 `inner`는 함수 내부에서 `a`라는 변수를 사용하는데, 이 `a`는 `lexicalEnvironMent`에서 `outerEnvironmentReference`에 의해 참조된 outer 함수의 a 입니다.

outer 함수가 실행되고 나서 outer의 실행 컨텍스트는 GC에 의해서 없어져야 하는게 맞지만, outer()에 의해 반환된 inner() 함수를 q에 저장해서 사용하기 때문에 이 컨텍스트는 GC에 의해 사라지지 않습니다. 그리고, a가 만약 outer 함수 내부에 정의되었다면 이후 outer 내부의 a에 직접 접근을 할 수 없습니다. 하지만 outer 함수의 return된 inner의 경우 outer의 a값을 계속 활용할 수 있게 됩니다.

> 그렇기에, 클로저란 어떤 함수 A에서 선언된 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우, A의 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상

이라고도 볼 수 있습니다. 여기서 주의할 점은, 외부로 전달이 return만을 의미하는 것은 아니라는 것 입니다.

```js
;(function() {
  var a = 0
  var intervalId = null
  var inner = function() {
    if (++a >= 10) {
      clearInterval(intervalId)
    }
    console.log(a)
  }
  intervalId = setInterval(inner, 1000)
})()
```

```js
function() {
    var count = 0;
    var button = document.createElement('button');
    button.innerText = 'click';
    button.addEventListener('click', function() {
        console.log(++count, 'times clicked);
    });
    document.body.appendChild(button);
}
```

위 두 상황 모두 지역변수를 참조하는 내부함수를 외부에 전달했기 때문에 클로저 입니다.

## 클로저와 메모리 관리

클로저의 경우 따로 조치를 취하지 않는다면 GC에 수집되지 않기 때문에 메모리 누수가 발생 할 수도 있습니다. 개발자가 의도적으로 GC의 대상으로 만들지 않은 이상은 누수라 할 수 없습니다.

메모리를 관리하기 위해서는, 클로저가 필요에 의해 의도적으로 함수의 지역변수를 사용하여 메모리를 소모하게 하는 것 이므로, 필요성이 사라진 시점에 메모리를 소모하지 않게 해주면 됩니다. 참조 하는게 없어지면 GC가 수거하게 되니, 식별자에 참조형이 아닌 기본형 데이터 (null이나 undefined) 또는 remove와 관련된 함수 또는 메서드를 사용해서 관리 해주면 됩니다.

```js
var outer = (function() {
  var a = 1
  var inner = function() {
    return ++a
  }
  return inner
})()

console.log(outer()) // 2
console.log(outer()) // 3
console.log(outer()) // 4
outer = null
```

```js
;(function() {
  var a = 0
  var intervalId = null
  var inner = function() {
    if (++a > 10) {
      clearInterval(intervalId)
      inner = null // inner 식별자의 함수 참조를 끊음
    }
    console.log(a)
  }
  intervalId = setInterval(inner, 300)
})()
```

```js
;(function() {
  var count = 0
  var button = document.createElement("button")
  button.innerText = "click"
  document.body.appendChild(button)
  var handleClick = function() {
    console.log(++count, "times clicked")
    if (count >= 10) {
      button.removeEventListener("click", handleClick)
      handleClick = null
    }
  }
  button.addEventListener("click", handleClick)
})()
// 10번 콘솔이 찍히고, 그 이 후부터 버튼을 눌러도 콘솔이 찍히지 않습니다.
```

## 클로저 활용 사례

### 콜백 함수 내부에서 외부 데이터를 ㅏㅅ용하고자 할 때

```js
const fruits = ["apple", "banana", "coconut"]
const $ul = document.createElement("ul")

fruits.forEach(function(fruit) {
  const $li = document.createElement("li")
  $li.innerText = fruit
  $li.addEventListener("click", function() {
    alert("your choice is" + fruit)
  })
  $ul.appendChild($li)
})

document.body.appendChild($ul)
```

여기서, alert이 계속 쓰인다면 이를 외부로 분리해서 사용 할 것입니다.

```js
const fruits = ["apple", "banana", "coconut"]
const $ul = document.createElement("ul")
const alertFruit = function(fruit) {
  alert("your choice is" + fruit)
}
fruits.forEach(function(fruit) {
  const $li = document.createElement("li")
  $li.innerText = fruit
  $li.addEventListener("click", alertFruit.bind(this, fruit))
  $ul.appendChild($li)
})
document.body.appendChild($ul)
```

이렇게 된다면, this를 바인딩 해서 사용 할 수도 있지만 여기서 문제점이 되는점은 eventListener에 등록한 콜백은 이벤트 객체를 사용해야 하는데, 이때 인자의 순서가 조금 달라진다는 점이 있습니다.

`$li.addEventListener('click', alertFruit.bind(this, fruit));`에서, 현재 bind에서 fruit만 들어가지만, 실제 이벤트 리스너의 콜백에서 사용되는 `alertFruit`는 두번째 인자로 이벤트 객체를 가지고 있습니다.

이를 조금 더 함수형 프로그래밍 스럽게, 고차 함수로 표현하면 다음과 같습니다.

```js
const fruits = ["apple", "banana", "coconut"]
const $ul = document.createElement("ul")
const alertFruit = function(fruit) {
  return function(e) {
    console.log(e)
    alert("your choice is" + fruit)
  }
}
fruits.forEach(function(fruit) {
  const $li = document.createElement("li")
  $li.innerText = fruit
  $li.addEventListener("click", alertFruit(fruit))
  $ul.appendChild($li)
})
document.body.appendChild($ul)
```

이렇게 하면, console에는 이벤트 객체가 찍히고, alert에는 원하는 텍스트가 나타나게 됩니다.

### 접근 권한 제어 (정보 은닉)

정보 은닉은 어떤 모듈의 내부 로직에 대해 외부로 노출을 최소화해서 모듈간 결합도를 낮추고 유연성을 높이려 하는 현대 프로그래밍 언어의 중요한 개념 중 하나입니다. 자바 스크립트는 변수 자체에 다른 OOP언어에서 사용하는 접근 제한자를 최근에야 도입했습니다.

그렇기에, 접근 제한자가 없던 시절 private한 값을 만들기 위해 클로저를 사용할 수 있습니다.

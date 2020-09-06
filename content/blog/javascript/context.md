---
title: Execution Context에 대해 Araboza
date: "2020-09-04"
tags: [javascript]
description: "Javascript의 실행 컨텍스트에 대해 알아보는 시간을 갖도록 하자."
thumbnail: ./imgs/context.png
---

실행 컨텍스트는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체로, JS의 동적 언어로의 성격을 가장 잘 파악할 수 있는 개념입니다. 자바스크립트는 어떤 실행 컨텍스트가 활성화 되는 시점에서 선언된 변수를 위로 끌어올리고(호이스팅), 외부 환경 정보를 구성하고, this 값을 설정하는 등의 동작을 수행합니다.

## 실행 컨텍스트

실행 컨텍스트는 `실행할 코드에 제공할 환경 정보를 모아놓은 객체` 입니다.  

1. 동일한 환경에 있는 코드들을 실행할 때 필요한 환경 정보들을 모아 컨텍스트를 구성하고
2. 이를 콜 스택에 쌓아올렸다가
3. 가장 위에 쌓여있는 컨텍스트와 관련 있는 코드들을 실행하는 식으로 전체 코드의 환경과 순서를 보장합니다.

자동으로 생성되는 전역공간과, eval을 제외하면 실행 컨텍스트를 구성하는 방법은 `함수를 실행`하거나 `블록()`에 의해서 만드는 것 입니다.

```js
// ------------- (1)
var a = 1;
function outer() {
    function inner() {
        console.log(a); // undefined
        var a = 3;
    }
    inner(); // -------- (2)
    console.log(a); // 1
}

outer(); // ------- (3)
console.log(a); // 1
```

처음 자바스크립트 코드를 실행하는 순간(1) 전역 컨텍스트가 콜 스택에 담깁니다. 전역 컨텍스트는 일반 실행 컨텍스트와 크게 다르지 않지만, 전역 컨텍스트가 관여하는 대상은 함수가 아닌 전역 공간이기 때문에 `arguments` 가 없으며, 스코프 체인상 전역 스코프는 하나만 존재하게 됩니다.

최상단 컨텍스트는 브라우저에서 자동으로 실행하므로, 자바스크립트 파일이 열리는 순간 전역 컨텍스트가 활성화된다고 이해하면 됩니다.

콜 스택에서는 전역 컨텍스트 외에 다른 컨텍스트가 없으므로  전역 컨텍스트와 관련된 코드들을 순차적으로 실행하다가, (3) 에서 outer()를 호출하면 JS 엔진은 outer에 대한 환경 정보를 수집해서 Outer 실행 컨텍스트를 생성한 후 콜 스택에 담습니다.

콜스택 맨 위에 outer실행 컨텍스트가 놓인 상태가 됐으므로 전역 컨텍스트 관련된 코드 실행을 일시 중단하고, outer 실행 컨텍스트와 관련된 코드를 순차적으로 실행합니다.

(2) 에서 inner 함수의 실행 컨텍스트가 콜 스택 가장 위에 담기면 outer 컨텍스트와 관련된 코드의 실행을  중단하고  inner 함수 내부의 코드를 순서대로 진행합니다.

inner 함수 내부에서 a를 호출하고 나면 inner 함수의 실행이 종료되며 inner 실행 컨텍스트가 콜 스택에서 제거됩니다. 그러면 아래 있던 outer 컨텍스트가 콜 스택 맨 위에 존재하게 되므로, 중단되었던 부분부터 다시 이어서 실행합니다.

이후 outer 컨텍스트에서 a를 출력하고, outer 함수의 실행이 종료되며 outer 실행 컨텍스트가 콜 스택에서 제거되며, 콜 스택에는 전역 컨텍스트만 남게 됩니다.

이후 실행을 중단했던 부분부터 이어서 시작하여 a를 호출하고 나면 전역 공간에 더는 실행할 코드가 남아 있지 않아 전역 컨텍스트도 제거되어 콜 스택은 비게 됩니다.

스택 구조 특성상, 한 실행 컨텍스트가 콜 스택 맨위에 쌓이는 순간히 현재 실행할 코드에 관여하게 되는 시점이 됩니다. 기존의 컨텍스트는 새로 쌓인 컨텍스트보다 아래에 위치할 수 밖에에 없습니다. 이렇게 어떤 실행 컨텍스트가 활성화 될 때 자바스크립트 엔진은 해당 컨텍스트에 관련된 코드들을 실행하는데 필요한 환경 정보들을 수집해서 실행 컨택스트 객체어 저장합니다. 이 객체는 자바스크립트 엔진이 활용할 목적으로 생성 할 뿐, 개발자가 코드를 통해 확인 할 수 없습니다. 여기에 담기는 정보는 다음과 같은데

* VariableEnvironment : 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보. 선언 시점의 `LexicalEnvironment`의 스냅샷으로 변경 사항은 반영되지 않음
* LexicalEnvironment : 처음에는 `VariableEnvironment`와 같으나 변경 사항이 실시간 반영
* ThisBinding: this 식별자가 바라봐야 할 대상 객체

### VariableEnvironment

VariableEnvironment에 담기는 내용은 LexicalEnvironment와 같지만 최초 실행 시의 스냅샷을 유지한다는 점이 다릅니다.  
실행 컨텍스트를 생성할 때

* `VariableEnvironment`에 먼저 정보를 담고,
* 이를 그대로 복사해서 `LexicalEnvironment`를 만든 이후
* 이후에는 `LexicalEnvironment`를 주로 이용하게 됩니다.

VariableEnvironment와 LexicalEnvironment 내부에는 `environmentRecord`와 `outer-environmentRecord`로 구성되어 있습니다. 초기화 과정 중에는 사실상 완전히 동일하고, 이후 코드 진행에 따라 서로 달라지게 됩니다.

### LexicalEnvironment

* environmentRecord
* outer-environmentRecord

#### environmentRecord와 호이스팅

environmentRecord에는 현재 컨텍스트와 관련된 코드의 식별자 정보들이 저장됩니다.

* 컨텍스트를 구성하는 함수에 지정된 매개변수 식별자
* 선언한 함수가 있을 경우 그 함수 자체
* var, let, const 등으로 선언된 변수의 식별자

> 전역 실행 컨텍스트는 변수 객체를 생성하는 대신 JS 구동 환경이 별도로 제공하는 전역 객체를 활용합니다.

변수 정보를 수집하는 과정을 모두 마쳐도 아직 실행 컨텍스트가 관여할 코드들은 실행되기 전의 상태이며, 코드가 실행되기 전임에도 자바스크립트 엔진은 이미 해당환경에 속한 코드의 변수명들을 모두 알고 있게 됩니다. 즉 이는 자바스크립트 엔진은 식별자들을 최상단으로 끌어올려놓은 다음(hoist), 실제 코드를 실행한다고도 이해 할 수 있습니다. 여기서 `호이스팅`이 등장하는데, 변수 정보를 수집하는 과정을 이해하기 쉽게 하기 위해, `끌어 올린다(hoist)`라는 가상의 개념을 넣어 이해를 돕게 합니다.

##### 호이스팅 규칙

`environmentRecord`에는 매개변수 이름, 함수 선언, 변수명이 담깁니다.

```js
function a(x) { // 수집 대상 1 (매겨변수)
    console.log(x); // (1)
    var x; // 수집 대상 2 (변수 선언)
    console.log(x); // (2)
    var x = 2; // 수집 대상 3 (변수선언)
    console.log(x); // 3
}
a(1);
```

위의 예제는 인자들과 함께 함수를 호출한 경우의 동작을 살펴 봤을 때, `arguments`에 전달된 인자를 담는 것을 제외하면, 아래와 변수를 선언한 것과 유사합니다. 특히 LexicalEnvironment 입장에서는 같습니다. 즉, *인자*를 함수 내부의 다른 코드보다 먼저 `선언 및 할당`이 이뤄진 것으로 간주 할 수 있습니다.

```js
function a(x) {
    var x = 1;
    console.log(x);
    var x;
    console.log(x);
    var x = 2;
    console.log(x);
}
a();
```

이 상태에서 변수 정보 수집과정, 즉 `호이스팅`을 처리해 보면, environmentRecord는 현재 실행될 컨텍스트의 대상 코드에 어떤 *식별자*들이 <u>있는지</u>에만 관심이 있고, 각 *식별자*에 어떤 값이 할당될 것인지는 관심이 <u>없습니다</u>

> environmentRecord는 식별자의 정의만 중요하고, 할당은 신경쓰지 않습니다.

그렇기에 변수를 호이스팅 할 때 변수명만 끌어올리고 할당 과정은 그 자리에 그대로 남겨둡니다.  
environmentRecord의 관심사에 맞춰 수집 대상을 끌어 올리면 다음과 같은 형태로 바뀌게 됩니다.

```js
function a() {
    var x;
    var x;
    var x;

    x = 1;
    console.log(x);
    console.log(x);
    x = 2;
    console.log(x);
}
```

그렇기에, 처음 예제에서 콘솔에 찍힌 x의 값은 `1, 1, 2`입니다.

```js
function a() {
    console.log(b); // 1
    var b = 'bbb'; // 수집 대상 (변수 선언)
    console.log(b); // 2
    function b() {}; // 수집 대상 (함수 선언)
    console.log(b); // 3
}
```

이는 아래와 같이 변환이 됩니다.

```js
function a() {
    var b;
    var b = function b() {};
    console.log(b);
    b = 'bbb';
    console.log(b);
    console.log(b);
}
```

즉, 결과는 `(1) b함수, (2) 'bbb', (3) 'bbb`라고 나오게 됩니다.

###### 함수 선언문과 함수 표현식

```js
function a(){} // 함수 선언문 . 함수명 a가 곧 변수명
var b = function () {} // (익명) 함수 표현식. 변수 b가 함수명
var c = function d() {} // 기명 함수 표현식. 변수명은 c, 함수명은 d. c()로 실행 가능
```

여기서 함수 선언문과 함수 표현식의 실질적인 차이는 다음과 같습니다.

```js
console.log(sum(1,2));
console.log(multiply(3,4));

function sum(a,b) {
    return a+b;
}

var multiply = function (a,b) {
    return a*b;
}
```

```js
// 호이스팅을 마친 상태
var sum = function sum (a,b) {
    return a+b;
}
var multiply;

console.log(sum(1,2));
console.log(multiply(3,4));

multiply = function (a,b) {
    return a*b;
}
```

*함수 선언문*은 전체를 호이스팅 한 반면, `함수 표현식`은 <u>변수 선언부만</u> 호이스팅 했습니다. 함수도 하나의 값으로 취급 할 수 있다는 자바스크립트의 특징이 여기서 차이를 만드는데요, 함수를 다른 변수에 값으로 `할당`한 것이 함수 표현식 입니다. 여기서 함수 선언문과 함수 표현식의 차이가 발생합니다.

이 부분이 자바스크립트로 코드를 작성할 때 문제점을 야기하는 부분인데, 글을 위에서 아래로, 왼쪽에서 오른쪽으로 읽는 문화환경에서 자라왔기 때문에 이런 실행 환경이 어색하고 거부감이 느낄 수 있습니다. 일반적으로, `선언 후 호출`이 자연스럽기 때문이지요.

함수 선언문이 혼란스러운 개념인 것은 이런 거부감 또는 문화에서만 나타나는게 아닙니다. 실 업무에서도 함수 선언문으로 정의한 코드가 문제를 일으킬 가능성이 높기 때문이지요.

예를 들어, 한 개발자가 `sum`이란 함수를 정의했습니다. 그리고 나중에 들어온 개발자가, sum 코드가 정의된 라인 이후 수많은 코드 다음에 다시 같은 이름으로 `sum`함수를 정의 했습니다.

```js
function sum(x, y) {
    return x + y;
}

var a = sum(1,2);

// .... 수 많은 라인

function sum(x,y) {
    return x + ' + ' + y + ' = ' + (x + y);
}
```

이렇게 된 코드의 경우, 전역 컨텍스트가 활성화 될 때 전역 공간에 선언된 함수들이 모두 가장 위로 끌어올려 집니다. 동일한 변수명에 서로 다른 값을 할당할 경우 나중에 할당한 값이 먼저 할당한 값을 덮어씌우며, 코드를 실행하는 중 실제로 호출되는 함수는 오직 마지막에 할당한 함수 입니다.

위의 경우, 원래 기존의 함수가 의도했던 반환값과는 다르게 수식의 결과가 반환이 되는데, 정작 원인이 되는 `sum`함수는 에러를 일으키지 않기 때문에 버그가 발생하고, 이런 버그는 자칫 잡기 어려운  에러가 되고는 합니다.

만약 모든 sum 함수를 `함수 표현식, var sum = fucntion() {}`으로 정의했다면 개발자들의 의도대로 잘 동작했을 것 입니다. 이처럼, 원활한 협업을 위해 전역 공간에 함수를 선언하거나, 동명의 함수를 중복 선언하는 경우도 없애야 하며, 만에 하나 전역 공간에 같은 이름의 함수가 여럿 존재하는 상황이 생길 경우 모든 함수가 함수 표현식으로 정의 돼 있었다면 다음과 같은 상황이 발생하지 않을 것 입니다.

#### outerEnvironmentReference, Scope

`scope`란 식별자에 대한 유효범위 입니다. 경계 A의 외부에서 선언한 변수는 A의 외부뿐 아니라, A의 내부에서도 접근 하지만, A의 내부에 선언한 변수는 A의 내부에서만 접근 할 수 있습니다. 이런 스코프 개념은 대부분의 언어에 존재합니다. 자바스크립트의 경우 `var, 함수 선언식으로 만들어진 함수`는 함수에 의한 스코프, `let, const, class, stric mode`는 블록에 의한 스코프가 생성 됩니다.

```js
function foo() {
    if (true) {
        var color = 'blue';
    }
    console.log(color); // blue
}
foo();

function foo2() {
    if(true) {
        let color = 'blue';
        console.log(color); // blue
    }
    console.log(color); // ReferenceError: color is not defined
}
foo2();
```

이런 식별자의 유효범위를 안에서 바깥으로 차례로 검색해 나가는 것을 `스코프 체인(scope chain)`이라 하며, 이를 가능하게 하는 것이  `LexicalEnvironment`의 두번째 수집 자료인 `outerEnvironmentReference` 입니다.

##### 스코프체인

outerEnvironmentReference는 현재 호출된 함수가 `선언될 당시`의 LexicalEnvironment를 참조합니다. *'선언한다'* 라는 행위가 실제로 일어날 수 있는 시점이란 콜 스택 상에서 어떤 실행 컨텍스트가 활성화된 상태일 때 뿐입니다.

어떤 함수를 선언(정의) 하는 행위 자체도 하나의 코드에 지나지 않으며 모든 코드는 실행 컨텍스트가 활성화 상태일 때 실행되기 때문입니다.

```js
function a() {
    function b() {
        function c() {

        }
    }
}
```

위와 같은 경우, 함수 C의 outerEnvironmentReference는 함수 B의 LexicalEnvironment를 참조하며, 함수 B의 LexicalEnvironment에 있는 outerEnvironmentReference는 다시 함수 B가 선언 될 때 (A) 의 LexicalEnvironment를 참조합니다. 즉 outerEnvironmentReference는 LinkedList의 형태를 띱니다. 그렇기에 선언 시점의 LexicalEnvironment를 참조하다보면 전역 컨텍스트의 LexicalEnvironment가 있을 것이며, 각 outerEnvironmentReference는 오직 자신이 선언된 시점의 LexicalEnvironment만 참조하고 있으므로 가장 가까운 요소부터 차례대로 접근하며 다른 순서로 접근할 수는 없습니다.

이런 구조적 특성 덕분에 여러 스코프에서 동일한 식별자를 선언한 경우에는 `무조건 스코프 체인 상 가장 먼저 발견된 식별자`에만 접근 가능하게 됩니다.

```js
var a = 1;
var outer = function() {
    var c = 57;
    var inner = function() {
        console.log(a);
        var a = 3;
    };
    inner();
    console.log(a);
    var func = function() {
        return c;
    }
    return func;
};
var q = outer();
console.log(a)
console.log(q());
console.log(c);

// undefined 1 1 57 ReferenceError
```

* 첫번재 콘솔의 경우 inner함수에서의 console이 찍히게 되는데, var a 가 호이스팅 되면서 `undefined` 값이 찍히게 되며, `a=3` 을 할당하고 함수를 종료합니다.
* 이후 inner 함수를 실행하고, console을 찍게 되는데, outer함수에는 a를 선언하지 않았기 때문에, 외부 스코프에 있는 a인 1을 a의 값으로 활용하여 출력합니다.
* outer 함수가 종료되고, func 함수를 반환합니다.
* 전역에서 console을 찍었을 때, a는 1이기에 1을 호출합니다.
* q는 outer함수를 호출하고 리턴된 값에는 func라는 함수를 가지고 있습니다. 이 func함수는 c를 반환하기에 57을 console에 기록합니다.
* c는 outer함수 내부에서 정의 했기에 전역에서는 접근 할 수 없습니다.

여기서 클로저의 개념을 사용할 수 있는데요, [자바스크립트의 스코프와 클로저 - Toast](https://meetup.toast.com/posts/86) 에 따르면, 클로저를 다음과 같이 정의할 수 있다고 합니다.

```
클로저 = 함수 + 함수를 둘러싼 환경(Lexical environment)
```

자바스크립트의 클로저는 함수가 생성되는 시점에 생성되며, 함수가 생성될 때, 그 함수의 렉시컬 환경을 포함하여(closure) 실행될 때 이용합니다.

따라서 자바스크립트의 모든 함수는 클로저 이지만, 실제로 자바스크립트의 모든 함수를 전부 클로저라고 부르지 않고, 리턴된 함수가, 그 함수의 정의시에 참조하는 변수의 환경을 가지고 있을 때 클로저라 부릅니다.

이 클로저로 유명한 문제가 있습니다.

```js
function count() {
    var i;
    for (i = 1; i < 10; i += 1) {
        setTimeout(function timer() {
            console.log(i);
        }, i*100);
    }
}
count();
```
이 코드는 0.1 초마다 1...9까지 호출하려는 코드인데, 결과로 10이 9번 출력이 되었습니다. 그 이유는, setTimeout이 비동기 함수이고, 비동기 처리를 하기전에 i가 이미 10까지 증가했기 때문입니다.

```js
function count() {
    for (var i = 1; i < 10; i += 1) {
        setTimeout(function timer() {
            console.log(i);
        }, i*100);
    }
}
count();
```

이렇게 해도 똑같은 문제가 발생합니다. setTimeout 콜백이 실행될 때, 이미 i는 10의 값을 가지고 있기 때문이지요. 그래서 이를 해결하기 위한 방법 중 하나가

* 새로운 스코프를 추가하여 반복시 i 값을 저장하는 것 입니다.

```js
function count() {
    for (var i = 1; i < 10; i += 1) {
        setTimeout((function timer(idx) {
            console.log(i);
        })(i), i*100);
    }
}
count();
```

* 또는 es6에 추가된 블록 스코프를 이용하는 방법도 있습니다. => 이를 적극 추천합니다.

```js
function count() {
    for (let i = 1; i < 10; i += 1) {
        setTimeout(function timer() {
            console.log(i);
        }, i*100);
    }
}
count();
```

## 정리

* 실행 컨텍스트는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체 입니다.  
* 실행 컨텍스트는 다음과 같이 나뉘게 됩니다.

  * 전역 컨텍스트 : 전역 공간에서 자동 생성
  * eval 및 함수 실행에 의한 컨텍스트

* 실행 컨텍스트 객체는 활성화 되는 시점에

  * VariableEnvironment
  * LexicalEnvironment
  * ThisBinding

이 세가지 정보를 수집합니다.

* 실행 컨텍스트를 생성할 때 `VariableEnvironment`와 `LexicalEnvironment`가 동일한 내용으로 구성됩니다.
  * `LexicalEnvironment`는 함수 실행 도중 변경되는 사항을 즉시 반영합니다
  * `VariableEnvironment`는 초기 상태를 유지합니다.

* LexicalEnvironment와 VariableEnvironment는
  * 매개변수명, 변수 식별자, 선언한 함수의 함수명 등을 수집하는 `environmentRecord`
  * 직전 컨텍스트의 lexicalEnvironment 정보를 참조하는 `outerEnvironmentReference`로 구성돼 있습니다.

* 호이스팅은 코드 해석을 수월하기 위해 environmentRecord의 수집 과정을 추상화한 개념입니다.
* 변수 선언과 값 할당이 동시에 이뤄진 문장은 `선언부`만 호이스팅하고, 할당 과정은 원래 자리에 남게 됩니다.
  * 이게 함수 선언문과 함수 표현식의 차이를 유발합니다.

* 스코프는 변수의 유효범위를 말합니다.
* outerEnvironmentReference는 해당 함수가 선언된 위치의 LexicalEnvironment를 참조합니다.
  * 코드상 어떤 변수에 접근할 때, 현재 컨텍스트의 LexicalEnvironment를 탐색해서 발견되면 그 값을 반환하고
  * 발견하지 못할 경우 outerEnvironmentRecord에 담긴 LexicalEnvironment를 탐색하는 과정을 거칩니다
  * 전역 컨텍스트의 LexicalEnvironment까지 탐색해도 변수를 찾지 못하면 `undefined`를 반환합니다.

* 전역 컨텍스트의 LexicalEnvironment에 담낀 변수를 전역변수라 하며, 그 밖의 함수에 의해 생성된 실행 컨텍스트의 변수들은 모두 지역 변수입니다.

---
title: Bundler와 Transpiler
date: "2020-12-04"
tags: [javascript]
description: "환경 설정은 여전히 어렵습니다만...?"
thumbnail: ./imgs/module_bundler.png
---

## Bundler

네이버 영어 사전에서 Bundle을 검색 했을 때, 명사형으로 `꾸러미, 묶음, 보따리`, 동사형으로 `~을 마구 싸 보내다[밀어 넣다]`라는 의미를 가지고 있습니다. Bundler는 `짐을 꾸리는 사람 , 일괄 판매점.`이라는 의미를 가지고 있습니다.

즉, Javascript Bundler는 Javascript를 묶어주는 도구라고 해석 할 수 있습니다.

Javascript Bundler의 대표주자인 `webpack`의 설명은 다음과 같습니다.

> webpack is a static module bundler for modern JavaScript applications
>
> 웹팩은 모던 자바스크립트 어플리케이션을 위한 정적 모듈 번들러 입니다.

이 문장에서 저는 세가지 의문점이 있었습니다.

* 왜 모던 자바스크립트 어플리케이션을 위할까 ?
* 모듈 번들러란 무엇일까?
* 왜 정적일까 ?

### 모던 자바스크립트 어플리케이션의 등장

재그 지그님의 JavaScript 번들러로 본 조선시대 붕당의 이해 라는 게시글에서 자세히 나와서 인용합니다.

> 최초의 JavaScript는 HTML에서 JavaScript 원본 소스를 제공하고, 브라우저에서 이것을 순서대로 로드하는 방식으로 모듈 시스템을 제공 하였습니다.

```html
<html>
<body>
<script src="/src/a.js">
<script src="/src/aa.js">
<script src="/src/b.js">
<script src="/src/c.js">
</body>
</html>
```

이렇게 스크립트를 로드하는 방식은 아주 간단하나, 치명적인 문제가 있었습니다. 전역 컨텍스트에서 각 모듈 간의 충돌이 발생한다는 것 이었습니다. 예를 들어,

```js
// a.js
var a = "HELLO WORLD";
var b = "Javascript World";
window.addEventListener('load', function() {
    console.log(a,b);
}) // HELLO WORLD!!! Javascript World!!!
```

```js
// b.js
var b = "HELLO WORLD!!!";
var b = "Javascript World!!!";
```

위 `a.js`파일에서 window가 load 완료후 콘솔을 찍어보면, 변수 a와 b의 값이 `a.js`에 정의된 값이 사용되는게 아니라 `b.js`에 있는 값이 사용되는 것을 확인 할 수 있습니다.

이런 전역 변수의 오염을 피하기 위해 모듈과 변수이름이 겹치지 않으면서, 모듈을 순서대로 로드하기 위해 개발자들은 많은 노고를 기울였습니다.

그리고 2004년 4월 1일, 구글이 GoogleMap을 발표하며 Ajax가 활발하게 사용되며, 사용자 인터랙션에 대응하여 브라우저가 만

## 참고 자료

* [재그지그 - JavaScript 번들러로 본 조선시대 붕당의 이해](https://wormwlrm.github.io/2020/08/12/History-of-JavaScript-Modules-and-Bundlers.html)
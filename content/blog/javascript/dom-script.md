---
title: DOM 관련 메소드를 정리합니다.
date: "2021-04-05"
tags: [html, javascript]
description: "dom.closest, element.insertAdjacentHTML"
thumbnail: ./imgs/html-height.png
---

## Element.insertAdjacentHTML

`Element.insertAdjacentHTML(position: string, text:string): void`

* HTML or XML 같은 특정 텍스트를 파싱하고, 특정 위치에 DOM tree 안에 원하는 node들을 추가
*  이미 사용중인 element 는 다시 파싱하지 않음. 그러므로 element 안에 존재하는 element를 건드리지 않는다. (innerHtml과는 다르다). 
*  innerHtml보다 작업이 덜 드므로 빠르다.

> element.insertAdjacentHTML(position, text)

* position
  * beforebegin : element 앞
  * afterbegin : element안 첫번째 child
  * beforeend : element 내부 마지막 child
  * afterend : element 뒤

```javascript
// <div id="one">one</div>
const d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

// At this point, the new structure is:
// <div id="one">one</div><div id="two">two</div>
```

## element.closest

`element.closest(selector: string): HTMLElement | null`

* 기준 Element 에서부터 closest() 메소드를 통해 자신부터 부모 요소 단위로 출발하여 각 요소가 지정한 선택자에 만족할 때까지 탐색한다(문서 루트까지 이동).
* 이 중 가장 가깝게 조건에 만족한 부모 요소가 반환되며, 조건에 만족한 요소가 없으면 null 값을 반환한다.

```js
const closestElement = targetElement.closest(selectors);
```


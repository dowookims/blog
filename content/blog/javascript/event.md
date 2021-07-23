---
title: JAVASCIPRT Event에 대해 알아보자
date: "2021-07-24"
tags: [javascript]
description: "Event 대해 알아보는 시간을 가지도록 하도록 하도록 합시다."
thumbnail: ./imgs/event.png
---

## 1. 왜 알아보는가 ?

회사에서 `mousedown, mousemove, mouseup` 으로 인터렉션을 하는 컴포넌트를 개발했습니다. 제가 담당하고 있는 프로젝트 특성상 만들어진 컴포넌트가 웹뷰를 통해 태블릿으로 보여지고, 동작하게 되어야 합니다. 그래서 touch와 관련된 이벤트를 추가했습니다.

**addEventListener** 로 이벤트를 추가하는 것은 어려운 일이 아닙니다. 콜백으로 사용하는 함수의 경우 기존 mouse event에서 콜백으로 사용하는 함수를 사용하면 되기에 별 문제가 없을 것이라 생각했습니다.

그러나 터치 이벤트는 사용하는 기기가 바뀌기 때문에 고려해야 할 사항들이 꽤 있었습니다. 제가 직면한 문제는 다음과 같습니다.

1. 컴퓨터의 경우 인터렉션을 위해 마우스를 사용하지만, 태블릿의 경우 터치를 위해 애플 펜슬과 같은 터치를 도와주는 기구를 쓰지 않을수도 있습니다. 이경우 가장 터치하는데 많이 사용하는 도구인, **손가락** 을 기준으로 터치 영역을 잡았어야 했습니다. 그러나 마우스를 기반으로 사용하는 것 만큼의 터치 영역을 잡았기에, 실제 손가락으로 인터렉션을 일으키는게 어려웠었고 이는 간단하게 해결했습니다.

2. 터치 이벤트를 추가 했을 때, touchmove가 발생할 때 스크롤도 엄청나게 발생했습니다. 쿵쾅쿵쾅 거리는 화면을 보면서 무언가 잘못됨을 느끼고 일단 막아보자 생각하고 **preventDefault** 를 설정했습니다.

3. **preventDefault**를 설정하니 브라우저에서 경고를 합니다. `passive` 와 관련된 설정을 하라고 나오는데 이는 왜 나오는거고, passive는 어떤 일을 하는걸까 라는 궁금증이 생겼습니다.

그래서 알아보도록 하면서 같이 이것 저것 알아보려고 합니다.

## 2. 이벤트의 흐름

stackoverflow에 있는 글인 [What is event bubbling and capturing?](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing) 에서 좋은 자료와 이미지를 찾았습니다.

![javascript event flow](https://i.stack.imgur.com/LsIr2.png)

Dom event는 총 4가지의 실행 단계를 가지고 있습니다.

1. event.NONE
   이벤트 발생시 **event** 인자를 사용하여 **NONE**에 접근하면 0의 값을 가집니다. 아무런 이벤트도 발생하지 않았음을 의미합니다.

2. event.CAPTURING_PHASE
   1의 값을 가지며, 이벤트가 상위 개체를 통해 전파됩니다. **Window, Document**에서 시작하여 DOM 트리를 따라 대상의 부모에 도달할 때 까지 요소들을 통과 합니다. 이 단계에서 **addEventListener**가 호출될 때 캡처 모드에 있는 이벤트리스너가 트리거 됩니다.

3. event.AT_RANGE
   2의 값을 가지며, event가 **eventTarget**에 도착합니다. 이 단계에서 등록된 이벤트 리스너가 호출됩니다. 만약 Event.bubbles이 false라면 이 단계가 오나료된 다음 이벤트 진행은 종료 됩니다.

4. event.BUBBLING_PHASE
   3의 값을 가집니다. 이벤트가 역순으로 조상을 통해 전파 됩니다. 부모로부터 시작해, **Window** 를 포함하는 단계까지 도달합니다. Event.bubbles가 **true** 때만 발생합니다.

설명만 봐서는 자세히 이해가 되지 않기에 간단한 실습을 진행 해 봤습니다.

```html
<div id="d1">
    첫번째 이벤트
    <div id="d2">
        두번째 이벤트
        <div id="d3">
            세번째 이벤트
        </div>
    </div>
</div>
<script>
    const getDomById = id => document.getElementById(id);
    const d1 = getDomById('d1');
    const d2 = getDomById('d2');
    const d3 = getDomById('d3');
    d1.addEventListener('click', (e) => console.log('d1 called', e.target.id));
    d2.addEventListener('click', (e) => console.log('d2 called', e.target.id));
    d3.addEventListener('click', (e) => console.log('d3 called', e.target.id));
</script>
```

위와 같은 코드를 작성하고 실행을 해보면,

d3 => d2 => d1 순으로 호출이 됩니다. 자바스크립트의 이벤트들은 대부분 버블링되며 캡처링 되는 일은 거의 없습니다. 또한, 현대 브라우저들은 기본적으로 모든 이벤트들을 버블링 하게 끔 구현 되어 있습니다.

> 기본적으로 모든 이벤트 핸들러는 버블링 단계에 등록되어 있고, 이것은 대부분의 경우 더 타당합니다. 만약 정말로 이벤트를 캡처링 단계에 대신 등록하기를 원한다면 **addEventListener(eventType, callback, {capute: true})** 에서 보듯이, 세번째 인자에 **capture: true**로 두면 됩니다.

```html
<div id="d1">
        첫번째 이벤트
        <div id="d2">
            두번째 이벤트
            <div id="d3">
                세번째 이벤트
            </div>
        </div>
    </div>
    <script>
        const getDomById = id => document.getElementById(id);
        const d1 = getDomById('d1');
        const d2 = getDomById('d2');
        const d3 = getDomById('d3');
        d1.addEventListener('click', (e) => console.log('d1 called', e.target.id, e), {capture: true});
        d2.addEventListener('click', (e) => console.log('d2 called', e.target.id, e), {capture: true});
        d3.addEventListener('click', (e) => console.log('d3 called', e.target.id, e));
    </script>
```

이경우 d1 => d2 => d3 순으로 나타나게 됩니다.

여기서 재미있는 것을 발견했습니다. **d3** 만 **capute: true** 일 경우 이벤트 캡처링이 일어나지 않습니다. 그 이유는 **d3**의 부모 들이 버블링 단계를 따르기 때문입니다. 그렇기에 capture를 사용할 경우 DOM TREE내에서 캡처링할 부모와 자식의 관계를 잘 살펴보고 옵션을 넣어줘야 할 것 같습니다.

> 버블링과 캡처링, 두 타입의 이벤트 핸들러가 모두 존재하는 경우에, 캡처링 단계가 먼저 실행되고, 이어서 버블링 단계가 실행됩니다.

그렇다면 캡처링은 왜 나타난 걸까요?

MDN의 [이벤트 입문](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events) 을 보면 다음과 같습니다.

> 브라우저들이 지금보다 훨씬 덜 호환되던 옛날의 좋지 못하던 시절에  
> **Netscape**는 오직 **이벤트 캡처링**만을 사용했고,  
> **Internet Explorer**는 오직 **이벤트 버블링**만을 사용했습니다.  
> W3C가 이 움직임을 표준화하고 합의에 이르기를 시도하기로 결정했을 때, 그들은 양 쪽을 다 포함하는 이 시스템을 채용하게 되었는데, 이것이 현대 브라우저들이 구현한 것입니다.

이런 브라우저의 구조 때문에 우리는 버블링을 겪게 되고, 이를 피하고 싶을 경우도 생길 것 입니다. 이 때 **event.stopPropagation()** 을 사용함으로써 이벤트의 전파를 막을 수 있습니다.

이벤트 버블링은 유용하게 쓰일수도 있습니다. **이벤트 위임** 이라는 기법을 쓸 수 있기 때문입니다.

이벤트 위임이란, 다수의 자식 요소 중 하나를 선택했을 때 같은 이벤트 함수를 호출하길 원하면 자식 요소에 이벤트를 다 걸어주는게 아닌, 부모에 설정하고 자식에게서 일어난 이벤트가 부모에게 올라오게 하여 효율적으로 코드를 작성할 수 있게 합니다.

```html
<ul id="uls">
    <li class="lis">1</li>
    <li class="lis">2</li>
    <li class="lis">3</li>
    <li class="lis">4</li>
    <li class="lis">5</li>
    <li class="lis">6</li>
    <li class="lis">7</li>
    <li class="lis">8</li>
    <li class="lis">9</li>
    <li class="lis">10</li>
    <li class="lis">11</li>
    <li class="lis">12</li>
    <li class="lis">13</li>
    <li class="lis">14</li>
    <li class="lis">15</li>
    <li class="lis">16</li>
    <li class="lis">17</li>
    <li class="lis">18</li>
    <li class="lis">19</li>
    <li class="lis">20</li>
</ul>
<script>
    document.getElementById('uls').addEventListener('click', e => console.log(e.target.textContent))
</script>
```

## 참고자료

[Event.eventPhase](https://developer.mozilla.org/ko/docs/Web/API/Event/eventPhase)
[What is event bubbling and capturing?](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing)
[javascript.info](https://ko.javascript.info/bubbling-and-capturing)
[이벤트 입문](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events)

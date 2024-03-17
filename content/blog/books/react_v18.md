---
title: 리액트 v18 업데이트 정리
date: "2024-03-17"
tags: [books, 모던 리액트 딥다이브, design]
description: "모던 리액트 딥다이브 10장 리액트 v18에서 업데이트 된 내용을 정리 해 보았습니다."
---

# 1 새로이 추가된 훅

## useId

- 컴포넌트 별로 유니크한 값을 생성한다.
- 서버사이드와 클라이언트 사이드에서 사용시 동일한 값을 보장한다.

### 사용

- 접근성 속성을 위한 unique id를 만들 때

```jsx
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <input type="password" aria-describedby={passwordHintId} />
      <p id={passwordHintId}>
    </>
  )
}
```

- 여러 관련된 요소의 아이디를 만들 때

```jsx
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

- 구현체
    
    ```jsx
    function useId(): string {
      const hook = nextHook();
      const id = hook !== null ? hook.memoizedState : '';
      hookLog.push({
        displayName: null,
        primitive: 'Id',
        stackError: new Error(),
        value: id,
        debugInfo: null,
      });
      return id;
    }
    ```
    
    ```jsx
    function nextHook(): null | Hook {
      const hook = currentHook;
      if (hook !== null) {
        currentHook = hook.next;
      }
      return hook;
    }
    ```
    
    ```jsx
    export function inspectHooksOfFiber(
      fiber: Fiber,
      currentDispatcher: ?CurrentDispatcherRef,
    ): HooksTree {
      // DevTools will pass the current renderer's injected dispatcher.
      // Other apps might compile debug hooks as part of their app though.
      if (currentDispatcher == null) {
        currentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      }
    
      if (
        fiber.tag !== FunctionComponent &&
        fiber.tag !== SimpleMemoComponent &&
        fiber.tag !== ForwardRef
      ) {
        throw new Error(
          'Unknown Fiber. Needs to be a function component to inspect hooks.',
        );
      }
    
      // Warm up the cache so that it doesn't consume the currentHook.
      getPrimitiveStackCache();
    
      // Set up the current hook so that we can step through and read the
      // current state from them.
      currentHook = (fiber.memoizedState: Hook);
      currentFiber = fiber;
    
      const type = fiber.type;
      let props = fiber.memoizedProps;
      if (type !== fiber.elementType) {
        props = resolveDefaultProps(type, props);
      }
    
      const contextMap = new Map<ReactContext<any>, any>();
      try {
        setupContexts(contextMap, fiber);
    
        if (fiber.tag === ForwardRef) {
          return inspectHooksOfForwardRef(
            type.render,
            props,
            fiber.ref,
            currentDispatcher,
          );
        }
    
        return inspectHooks(type, props, currentDispatcher);
      } finally {
        currentFiber = null;
        currentHook = null;
    
        restoreContexts(contextMap);
      }
    }
    
    ```
    

## useTransition

- UI 변경을 막지 않고 상태를 업데이트할 수 있는 리액트 훅
    - 상태 업데이트를 긴급하지 않은 것으로 간주해 무거운 렌더링 작업을 미룰 수 있다.
- 동시성(concurrency)를 다룰 수 있는 새로운 훅
- 훅을 사용할 수 없는 환경에는 `startTransition` 을 바로 import 할 수 있다.
    - 파라미터로 scope을 받는다. scope 함수는 1개 이상의 set함수를 호출한다.
    - 리액트는 매개변수가 없는 scope 을 즉시 호출하고, scope 함수 호출 중 동기적으로 예약된 모든 상태 업데이트를 트랜지션으로 표기함
    - startTransition 내부는 반드시 상태를 업데이트하는 함수와 관련된 작업만 넘겨야 한다.
    - props나 사용자 정의 훅에서 반환하는 값을 사용하고 싶으면 `useDefferedValue` 를 사용

```jsx
import { memo, useCallback, useState, useTransition } from "react";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("about");
  const [pending, startTransition] = useTransition();
  // const handleClick = useCallback((tab: string) => {
  //   startTransition(() => {
  //     setTab(tab);
  //   });
  // }, []);
  const handleClick = useCallback((tab: string) => {
    setTab(tab);
  }, []);
  return (
    <div>
      <button onClick={() => handleClick("about")}>Home</button>
      <button onClick={() => handleClick("posts")}>POST</button>
      <button onClick={() => handleClick("contact")}>CONTACT</button>
      {pending ? (
        "로딩중"
      ) : (
        <>
          {tab === "about" && <div>HOME</div>}
          {tab === "posts" && <PostsTab />}
          {tab === "contact" && <div>contact</div>}
        </>
      )}
    </div>
  );
}

const PostsTab = memo(function PostsTab() {
  const items = Array.from({ length: 1500 }).map((_, i) => (
    <SlowPost key={i} index={i} />
  ));

  return <ul className="items">{items}</ul>;
});

const SlowPost = ({ index }: { index: number }) => {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {}
  return <li className="item">{index}</li>;
};

```

- startTransition을 쓰면 블로킹이 안된다.
- 즉각 렌더링을 시작하지 않고 `async` , `await` 처럼 비동기 렌더링하게 해준다.

## useDeferredValue

- 리액트 컴포넌트 트리에서 리렌더링이 급하지 않은 부분을 지연할 수 있게 도와주는 훅
    - debounce와 유사
        - 고정된 지연 시간이 필요하지 않다
        - 렌더링 완료된 이후 `useDeferredValue` 로 지연된 렌더링을 수행한다.
            - 사용자의 인터랙션을 차단하지 않음
        
        ```
        import {
          ChangeEvent,
          useDeferredValue,
          useMemo,
          useState,
        } from "react";
        import "./App.css";
        
        export default function App() {
          const [text, setText] = useState("");
          const deferredText = useDeferredValue(text);
          const list = useMemo(() => {
            console.count("list1");
            const arr = Array.from({ length: deferredText.length }).map(
              () => deferredText
            );
            return (
              <ul>
                {arr.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            );
          }, [deferredText]);
          const list2 = useMemo(() => {
            console.count("list2");
            const arr = Array.from({ length: text.length }).map(() => text);
            return (
              <ul>
                {arr.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            );
          }, [text]);
        
          function onChange(e: ChangeEvent<HTMLInputElement>) {
            setText(e.target.value);
          }
        
          
        
          return (
            <div>
              <input value={text} onChange={onChange} />
              <div className="box">
                {list} {list2}
              </div>
            </div>
          );
        }
        
        ```
        

### **주의사항**

- `useDeferredValue`에 전달하는 값은 문자열 및 숫자와 같은 원시값이거나, 컴포넌트의 외부에서 생성된 객체여야 합니다. 렌더링 중에 새 객체를 생성하고 즉시 `useDeferredValue`에 전달하면 렌더링할 때마다 값이 달라져 불필요한 백그라운드 리렌더링이 발생할 수 있습니다.
- `useDeferredValue`가 현재 렌더링(여전히 이전 값을 사용하는 경우) 외에 다른 값(`[Object.is](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)`로 비교)을 받으면 백그라운드에서 새 값으로 리렌더링하도록 예약합니다. `값`에 대한 또 다른 업데이트가 있으면 백그라운드 리렌더링은 중단될 수 있습니다. React는 백그라운드 리렌더링을 처음부터 다시 시작할 것입니다. 예를 들어 차트가 리렌더링 가능한 지연된 값을 받는 속도보다 사용자가 input에 값을 입력하는 속도가 더 빠른 경우, 차트는 사용자가 입력을 멈춘 후에만 리렌더링됩니다.
- `useDeferredValue`는 `[<Suspense>](https://ko.react.dev/reference/react/Suspense)`와 통합됩니다. 새로운 값으로 인한 백그라운드 업데이트로 인해 UI가 일시 중단되면 사용자는 폴백을 볼 수 없습니다. 데이터가 로딩될 때까지 이전 지연된 값이 표시됩니다.
- `useDeferredValue` 자체로 인한 고정된 지연은 없습니다. React는 원래의 리렌더링을 완료하자마자 즉시 새로운 지연된 값으로 백그라운드 리렌더링 작업을 시작합니다. 그러나 이벤트로 인한 업데이트(예: 타이핑)는 백그라운드 리렌더링을 중단하고 우선순위를 갖습니다.
- `useDeferredValue`로 인한 백그라운드 리렌더링은 화면에 커밋될 때까지 Effects를 실행하지 않습니다. 백그라운드 리렌더링이 일시 중단되면 데이터가 로딩되고 UI가 업데이트된 후에 해당 Effects가 실행됩니다.

```jsx
import { memo, useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

```

## useSyncExternalStore

- 라이브러리 제작시 사용
- react v17의 `useSubscription` 의 구현이 `useSyncExternalStore`  로 대체됨
- 테어링(tearing)
    - 하나의 state 값이 있음에도 서로 다른 값(state, prop)을 기준으로 렌더링 되는 현상

## useInsertionEffect

- 라이브러리 개발시에만 사용
- CSS의 추가 및 수정을 도와주는 hook
- 브라우저 렌더링의 재계산을 막게 해준다.
- useEffect와 비슷하나, DOM이 실제로 변경되기 전에 동기적으로 실행된다.
- 브라우저가 레이아웃을 계산하기전에 실행될 수 있게끔 해서 자연스러운 스타일 사입이 가능하다.
- useLayoutEffect와 유사하나 타이밍이 미묘하게 다르다. 두 훅 모두 렌더링이 되기 전에 실행 되지만,
    - useLayoutEffect는 DOM 변경 작업이 다 끝난 이후에 실행
    - useInsertionEffect는 DOM 변경 작업 이전에 실행
        - DOM 재계산을 막는다.

## react-dom/client

## createRoot

- react-dom에 있던 render 메서드를 대체한다.
- 리액트 18을 사용하려고 하면 위 함수를 사용해야 함

```jsx
import ReactDOM from 'react-dom'
import App from './app'
const container = document.getElementById('root');
ReactDOM.render(<App />, container)

import { createRoot } from 'react-dom/client';
const root = createRoot(container)
root.render(<App />)
```

## hydrateRoot

- SSR에서 hydrate 하기 위해 사용

```jsx
import ReactDOM from 'react-dom'
import App from './app'
const container = document.getElementById('root');
ReactDOM.hydrate(<App />, container)

import { hydrateRoot } from 'react-dom/client';
const root = hydrateRoot(container, <App />)
```

## react-dom/server

### renderToPipeableStream

- 리액트 컴포넌트를 HTML로 렌더링하는 메서드
- HTML을 점진적으로 렌더링하고 클라이언트에서는 중간에 script를 삽입하는 등의 작업 가능
- hydrateRoot를 호출하면 서버에서는 HTML을 렌더링하고, 클라이언트 리액트에서는 이벤트만 추가함으로 첫 로딩을 빠르게 수행할 수 있음

### renderToReadableStream

- renderToPipeableStream 이 node에서 동작 한다면 이 함수는 Web Stream 기반으로 동작
- 웹 스트림을 사용하는 모던 엣지 런타임(Cloudflare, deno)등
- 실제로 사용할 일은 없을 것

## 4 자동배치(Automatic Batching)

- 리액트가 여러 상태 업데이트를 하나의 리렌더링으로 묶어서 성능을 향상 시키는 것
- 버튼 한 번에 두개 이상의 state를 동시에 업데이트 하게 되면  이를 하나의 리렌더링으로 묶어서 수행할 수 있다.
- react v17 에서도 이미 그렇게 동작하지만, Promise, setTimeout 등 비동기 이벤트에서는 자동 배치가 이루어지지 않았음
    
    ```jsx
    import React from "react";
    import ReactDOM from "react-dom/client";
    import ReactDOM2 from "react-dom";
    import App from "./App.tsx";
    import "./index.css";
    
    ReactDOM2.render(<App />, document.getElementById("root")!);
    
    // ReactDOM.createRoot(document.getElementById("root")!).render(
    //   <React.StrictMode>
    //     <App />
    //   </React.StrictMode>
    // );
    
    ```
    

```jsx
import {
  Profiler,
  useCallback,
  useEffect,
  useState,
} from "react";
import "./App.css";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
export default function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const callback = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      console.group(phase);
      console.table({ id, phase, commitTime });
      console.groupEnd();
    },
    []
  );

  useEffect(() => {
    console.log("rendered");
  });

  function handleClick() {
    sleep(3000).then(() => {
      setCount((prev) => prev + 1);
      setFlag((f) => !f);
    });
  }

  return (
    <Profiler id="React18" onRender={callback}>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </Profiler>
  );
}

```

## 5 strict mode 강화

- 안전하지 않는 class component life cycle method에 대한 경고
    - UNSAFE가 붙은 라이프사이클 메서드
- 문자열 ref 사용 금지
    - 여러 컴포넌트에 걸쳐 사용될 수 있어 충돌의 여지가 있음
    - 문자열로만 참조가 존재하기에 어떤 ref에서 참조되고 있는지 파악이 어려움
    
    ```jsx
    class UnsafeClassComponent extends Component {
      componentDidMount() {
        console.log(this.refs.myInput);
      }
        render() {
    	    return (
    		    <div>
      		    // 아래와 같은 사용이 이제는 경고
    			    <input type="text" ref="myInput" />
    		    </div>
    	    )
        }
    }
    ```
    
- findDomNode에 대한 경고
    - 컴포넌트 인스턴스에서 실제 DOM요소에 대한 참조를 가져옴.
- 레거시 Context API 사용시 경고
    - childContextType, getChildContext
- 예상치 못한 side-effect 검사
    - 리액트 strict mode에서는 의도적으로 아래 함수를 이중으로 호출
        - 클래스 컴포넌트의
            - constructor
            - render
            - shouldComponentUpdate
            - getDerivedStateFromProps
            - setState의 첫 인수
        - 함수형 컴포넌트의 body
        - useState, useMemo, useReducer에 전달되는 함수
        - why?
            - FP에 따라 모든 컴포넌트는 항상 순수하기에, 이 원칙이 지켜지는지 확인.
            - 이를 위배하면 잠재적인 버그가 존재한다고 판단
    - v18에서는 회색으로 콘솔이 찍힌다. (v17 에서는 두번째 콘솔이 로깅 안되었음)
- v18에 useEffect가 2번 동작하게 변경
    - 컴포넌트가 첫 마운트 될 때마다 모든 컴포넌트를 자도으로 마운트해제 및 재마운트 해 두 번째 마운트 시 이전 상태로 복원
    - cleanup 을 추가하지 않았을 때 발생하는 버그르 찾기 위해

## 6 Suspense 기능 강화

- 기존 문제점
    - 컴포넌트가 보이기 전에 useEffect가 실행됨
    - 서버에서 사용 불가
- 마운트 되기 전에 effect가 실행되는 문제 수정 → 화면에 노출될 때 effect 실행
- Suspense로 인해 컴포넌트가 보이거나 사라질 때도 effect가 정상 실행
- 서버에서 실행 가능 (useMount 같은거 불필요)
- Suspense 내부에 throttle 추가

## 7 IE 지원 중단

아래와 같은 기능 사용 가능하다는 가정하에 배포

- Promise
- Symbol
- Object.assign

## 8 그외 변경사항

- 컴포넌트에서 undefined를 반환해도  에러가 생기지 않는다.
- <Suspense fallback={undefined}/> 도 null과 동일하게 처리
- renderToNodeStream 지원 중단. 대신 renderToPipeableStream사용 권장
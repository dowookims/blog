---
title: History, location 그리고 navigation에 대한 이해
date: "2023-03-20"
tags:
  [
    javascript,
    history api,
    히스토리API,
    location API,
    useHistory,
    useNavigate,
    useNavigation,
  ]
description: "자바스크립트의 history API와 location API, 그리고 React의 navigation에 대해 알아보자"
thumbnail: ./imgs/prototype.png
---

React-router의 `docs/start/concepts.md` 에 나와있느 문서를 먼저 확인 후 분석에 들어갑니다.

## Definitions

- **URL** - 주소 표시 줄의 URL입니다. React Router에서의 라우트가 아니라 단순히 URL입니다.
- **Location** - 내장된 브라우저의 window.location 객체를 기반으로 한 React Router 특정 객체입니다. Location은 "사용자가 어디에 있는지"를 나타냅니다. 대부분 URL의 값들 hash, param등 URL의 객체를 표현합니다.
- **Location State** - URL에 인코딩되지 않은 Location과 함께 지속되는 값입니다. URL에 인코딩된 해시나 검색 매개변수와 매우 유사하지만, 브라우저의 메모리에 보이지 않게 저장됩니다.
- **History Stack** - 사용자가 탐색할 때, 브라우저는 각 Location을 스택에 유지합니다. 브라우저에서 뒤로 버튼을 클릭하고 누르면 브라우저의 히스토리 스택을 볼 수 있습니다.
- **History** - 이 객체는 React Router가 URL의 변경 사항을 구독하고 브라우저 기록 스택을 프로그래밍 방식으로 조작할 수 있는 API를 제공하는 데 사용됩니다.
- **History Action** - Pop, Push, Replace 중 하나로, 사용자는 이러한 세 가지 이유 중 하나로 URL에 도달할 수 있습니다. 새 항목이 기록 스택에 추가되면 PUSH가 발생합니다(일반적으로 링크를 클릭하거나 프로그래머가 탐색을 강제하는 경우). REPLACE도 유사하지만 새 항목을 푸시하는 대신 스택의 현재 항목을 교체합니다. 마지막으로 사용자가 브라우저의 뒤로/앞으로 버튼을 클릭하면 POP이 발생합니다.
- **Path Pattern** - 이들은 URL처럼 보이지만, 동적 세그먼트 ("/users/:userId") 또는 스타 세그먼트 ("/docs/\*")와 같이 URL을 라우트에 일치시키기 위한 특수 문자를 가질 수 있습니다. 이것들은 URL이 아니라 React Router가 일치시키는 패턴입니다.
- **Segment** - 슬래시(/) 문자 사이의 URL 또는 경로 패턴의 부분입니다. 예를 들어 "/users/123"은 두 개의 세그먼트를 가지고 있습니다.
- **Dynamic Segment** - 경로 패턴의 동적 세그먼트로, 해당 세그먼트에서 모든 값을 일치시킬 수 있는 것을 의미합니다. 예를 들어 /users/:userId 패턴은 /users/123과 같은 URL에 일치합니다.
- **URL Params** - 동적 세그먼트에 일치하는 URL에서 구문 분석된 값입니다.
- **Router** - 모든 다른 컴포넌트와 훅을 작동시키는 상태 보존형(top-level) 컴포넌트입니다.
- **Route Config** - 현재 위치와 중첩(nesting)을 고려하여 순위를 매기고 일치시킬 라우트 객체의 트리입니다. 이를 통해 일치하는 라우트가 있는 브랜치(branch)를 만듭니다.
- **Route** - 일반적으로 { path, element } 또는 <Route path element> 형식을 갖는 객체 또는 라우트 요소입니다. path는 경로 패턴입니다. 경로 패턴이 현재 URL과 일치하면 element가 렌더링됩니다.
- **Route Element** - 또는 <Route>입니다. 이 요소의 props는 <Routes>에 의해 라우트를 생성하는 데 사용됩니다.
- **Nested Routes** - 라우트는 자식을 가질 수 있으며 각 라우트는 세그먼트를 통해 URL의 일부를 정의합니다. 따라서 하나의 URL은 트리의 중첩 "브랜치"에서 여러 라우트와 일치할 수 있습니다. 이를 통해 outlet, 상대 링크 등을 통해 자동 레이아웃 중첩이 가능합니다.
- **Relative links** - /로 시작하지 않는 링크는 렌더링된 가장 가까운 라우트를 상속합니다. 이를 통해 전체 경로를 알 필요 없이 더 깊은 URL로 링크하는 것이 쉬워집니다.
- **Match** - 라우트가 URL과 일치할 때 url 매개변수 및 일치한 경로 이름 등의 정보를 보유하는 객체입니다.
- **Matches** - 현재 위치와 일치하는 라우트(또는 라우트 구성의 브랜치)의 배열입니다. 이 구조를 통해 중첩 라우트가 가능합니다.
- **Parent Route** - 자식 라우트를 가진 라우트입니다.
- **Outlet** - 일치하는 라우트 중 다음 일치하는 라우트를 렌더링하는 컴포넌트입니다.
- **Index Route** - 경로가 없는 자식 라우트로, 부모의 URL에서 부모의 outlet에 렌더링됩니다.
- **Layout Route** - 특정 레이아웃 내에서 자식 라우트를 그룹화하는 데 사용되는 경로가 없는 상위 라우트입니다.

## History와 Location

React Router가 동작하려면 히스토리 스택의 변경 내용을 구독할 수 있어야 합니다.

브라우저는 사용자가 이동할 때마다 자체 히스토리 스택을 관리합니다. 뒤로 가기 및 앞으로 가기 버튼을 눌렀을 때 히스토리 스택이 변경 됩니다. 기존의 웹사이트(JavaScript가 없는 HTML 문서)에서는 사용자가 링크를 클릭하거나 폼을 제출하거나 뒤로 가기 및 앞으로 가기 버튼을 클릭할 때마다 브라우저가 서버에 요청을 보내게 됩니다.

예를 들어

```html
1. <a to="/dashboard">대시보드</a> 2. <a to="/accounts">계정</a> 3.
<a to="/customers/123">고객123</a> 4. 뒤로가기 버튼 5. <a to="/dashboard"></a>
```

을 순서대로 눌렀 을때, 히스토리 스택은 아래와 같이 변합니다 (굵게 칠한게 현재 URL)

1. **`/dashboard`**
2. `/dashboard`, **`/accounts`**
3. `/dashboard`, `/accounts`, **`/customers/123`**
4. `/dashboard`, **`/accounts`**, `/customers/123`
5. `/dashboard`, `/accounts`, **`/dashboard`**

### History Object

Client Side 라우팅을 사용하면 개발자가 브라우저 히스토리 스택을 프로그래밍 방식으로 조작할 수 있습니다. 예를 들어, 서버에 요청을 보내지 않고 URL을 변경하기 위해 다음과 같은 코드를 작성할 수 있습니다:

```javascript
<a
  href="/contact"
  onClick={event => {
    //  브라우저가 URL을 변경하고 새 문서를 요청하는 것을 막습니다.
    event.preventDefault()
    // 브라우저 히스토리 스택에 항목을 추가하고 URL을 변경
    window.history.pushState({}, undefined, "/contact")
  }}
/>
```

위의 코드는 URL을 변경하지만 UI에는 영향을 주지 않습니다. UI를 contact 페이지로 변경하려면 어딘가의 상태를 변경하는 코드를 더 작성해야합니다. 브라우저가 이러한 변경 사항을 구독해야 합니다.

브라우저는 pop event를 통해 URL의 변경 사항을 감지할 수 있습니다.

```javascript
window.addEventListener("popstate", () => {
  // URL changed!
})
```

하지만 이 이벤트는 사용자가 뒤로가기 또는 앞으로가기 버튼을 클릭할 때만 발생합니다. window.history.pushState 또는 window.history.replaceState를 호출한 경우에는 이벤트가 발생하지 않습니다.

이러한 경우에 React Router에서 제공하는 히스토리 객체가 필요합니다. 이 객체는 push, pop, replace와 관계없이 "URL 변경을 감지"하는 방법을 제공합니다.

```js
let history = createBrowserHistory()
history.listen(({ location, action }) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
})
```

앱들은 자체적인 히스토리 객체를 설정할 필요가 없습니다. 히스토리 객체를 설정하는 것은 `<Router>`의 업무입니다. `<Router>`는 이러한 객체 중 하나를 설정하고, 히스토리 스택의 변화를 구독하며, 마지막으로 URL이 변경될 때 상태를 업데이트합니다.

이로 인해 앱이 다시 렌더링되고 올바른 UI가 표시됩니다. 상태에 설정해야 할 유일한 것은 `location`이며, 나머지 모든 것은 그 단일 history 객체에서 작동합니다.

### Locations

브라우저는 `window.location` 으로 접근할 수 있는 Location 객체를 가지고 있습니다. Location은 URL에 대한 정보를 제공하며, 변경하는 몇 가지 메소드도 포함하고 있습니다.

```js
window.location.pathname //url의 패스 값을 가져옵니다.
window.location.hash // 해쉬값 이후의 텍스트를 가져옵니다.
window.location.reload() // 리로드
```

React Router 앱에서는 일반적으로 `window.location`을 사용하지 않고, React Router에서 제공하는 location을 사용합니다.

```js
{
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram",
  hash: "#menu",
  state: null,
  key: "aefz24ie"
}
```

세 가지 프로퍼티 { pathname, search, hash }는 `window.location`과 일치합니다. 이 세 가지를 모두 더하면 브라우저에서 사용자가 볼 수 있는 URL을 얻을 수 있습니다.

```javascript
console.log(location.pathname + location.search + location.)hash;
// /bbq/pig-pickins?campaign=instagram#menu
```

나머지 `{state, key}` 는 React Router 에서 사용합니다.

#### Location Pathname

`pathnname`은 URL에서 출처(origin) 이후의 부분입니다. 따라서 `https://example.com/teams/hotspurs`의 경우 pathname은 **/teams/hotspurs**입니다. 이것은 라우팅이 일치하는 위치의 유일한 부분입니다.

#### Location Search

URL의 search에 대해 사람들이 생각하는 것은 아래와 같습니다.

- location search
- search params
- URL search params
- query string

React Router에서는 `"location search"`라고 부르며, **URLSearchParams**의 직렬화된 버전입니다. 때로는 `URL search params`로도 부르기도 합니다.

```js
let location = {
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram&popular=true",
  hash: "",
  state: null,
  key: "aefz24ie",
}

let params = new URLSearchParams(location.search)
params.get("campaign") // "instagram"
params.get("popular") // "true"
params.toString() // "campaign=instagram&popular=true",
```

#### Location hash

URL의 해시는 현재 페이지의 스크롤 위치를 나타냅니다.

`window.history.pushState` API가 도입되기 전에는, 웹 개발자들은 URL의 해시 부분을 이용하여 클라이언트 사이드 라우팅을을 처리했습니다.

이 부분은 서버에 새로운 요청을 보내지 않고도 조작할 수 있는 유일한 부분이었으나, 오늘날에는 이를 설계된 목적에 맞게 사용할 수 있습니다.

#### Location State

`window.history.pushState()` API가 왜**push state**로 불리울까요? URL만 변경하는데 상태(State)를 왜 push 할까요? 그렇다면 `history.push` 가 맞지 않을까요?

우리는 이 API가 설계되는 과정에서 함께 있지 않았기 때문에 "상태"가 왜 중요시되었는지는 정확히 모르지만, 브라우저의 멋진 기능 중 하나입니다.

브라우저는 `pushState` 를 활용해 값을 전달하여 네비게이션 정보를 유지할 수 있도록 합니다. 사용자가 뒤로 가기 버튼을 클릭하면, history.state의 값이 이전에 "push"된 값으로 변경됩니다.

리액트 라우터에서는 `history.state`에 직접 접근할 필요가 없습니다.

React Router는 이 `history.pushState`를 활용하여 약간의 추상화를 거쳐 **location**에 값을 노출시킴으로써 사용합니다.

`location.state`은 **location.hash**나 **location.search**와 비슷하게 생각할 수 있습니다. 다른 점은 URL에 값을 넣는 대신, 숨겨진 상태로 유지된다는 것입니다. 이것은 프로그래머만 알고 있는 URL의 비밀과 같습니다.

location state의 좋은 사용 사례로

- 사용자가 어디에서 왔는지 알려주고 UI를 분기하는 방법을 다음 페이지에 알리는 것입니다.
  - 그리드 뷰에서 항목을 클릭하면 모달에서 레코드를 보여주는 것입니다.
  - 그러나 URL에 직접 접근한 경우 레코드를 별도의 레이아웃으로 보여줍니다(pinterest, 구버전 instagram).
- 목록에서 일부 레코드를 다음 화면으로 보내서 즉시 일부 데이터를 렌더링한 후 나머지 데이터를 나중에 가져올 수 있습니다.

location의 state를 두가지 방법으로 지정할 수 있습니다.

```jsx
;<Link to="/pins/123" state={{ fromDashboard: true }} />

let navigate = useNavigate()
navigate("/users/123", { state: partialUser })
```

이렇게 이동한 다음 페이지에서, `useLocation`을 아래와 같이 사용하면 됩니다.

```js
let location = useLocation()
location.state
```

location state의 값은 직렬화됩니다. 따라서 new Date()와 같은 값은 문자열로 변환됩니다. 그러니 사용시 주의해야 합니다.

#### Location Key

각 location은 고유한 키를 가집니다. 이것은 위치 기반 스크롤 관리, 클라이언트 측 데이터 캐싱 등과 같은 고급 케이스에 유용합니다. 각 새로운 location은 고유한 키를 가지기 때문에 일반 객체, 새로운 Map(), 심지어는 locationStorage에 정보를 저장하는 추상화를 구축할 수 있습니다.

예를 들어, 매우 기본적인 클라이언트 측 데이터 캐시는 위치 키 (및 fetch URL)별로 값을 저장하고 사용자가 다시 클릭할 때 데이터를 가져오는 것을 건너뛸 수 있습니다:

```jsx
let cache = new Map()

function useFakeFetch(URL) {
  let location = useLocation()
  let cacheKey = location.key + URL
  let cached = cache.get(cacheKey)

  let [data, setData] = useState(() => {
    // initialize from the cache
    return cached || null
  })

  let [state, setState] = useState(() => {
    // avoid the fetch if cached
    return cached ? "done" : "loading"
  })

  useEffect(() => {
    if (state === "loading") {
      let controller = new AbortController()
      fetch(URL, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (controller.signal.aborted) return
          // set the cache
          cache.set(cacheKey, data)
          setData(data)
        })
      return () => controller.abort()
    }
  }, [state, cacheKey])

  useEffect(() => {
    setState("loading")
  }, [URL])

  return data
}
```

## Navigating

URL이 변경될 때, React Router에서는 이를 **navigation**이라고 부릅니다. React Router에서는 다음과 같은 두 가지 방법으로 네비게이션할 수 있습니다:

- `<Link>` 컴포넌트를 사용하는 방법
- navigate 함수를 사용하는 방법

### Link

주요한 네비게이션 방법입니다. `<Link>`를 렌더링하여 사용자가 클릭할 때 URL을 변경할 수 있습니다. `<a></a>` tag처럼요.

React Router는 브라우저의 기본 동작을 방지하고 새 항목을 history 스택에 푸시하도록 알립니다. 위치가 변경되고 새로운 매칭된 페이지가 렌더링됩니다.

링크는 접근성 측면에서 여전히 `<a href>`를 렌더링하므로 (키보드, 초점, SEO 등의) 모든 기본 접근성 문제가 해결됩니다.

또한, "새 탭에서 열기"를 위한 오른쪽 클릭 또는 Command/Control 클릭과 같은 경우에는 브라우저의 기본 동작을 방지하지 않습니다.

### Navigate Function

```jsx
import { useNavigate } from 'react-router-dom';

이 함수는 useNavigate 훅에서 반환되며 프로그래머가 원하는 때에 URL을 변경할 수 있도록 합니다. 타임아웃에서 실행할 수 있습니다.

예를 들어 다음과 같이 setTimeout을 사용하여 3초 후에 새로운 URL로 이동할 수 있습니다.

function MyComponent() {
  const navigate = useNavigate();

  function handleClick() {
    setTimeout(() => {
      navigate('/new-url');
    }, 3000);
  }

  return <button onClick={handleClick}>Change URL</button>;
```

form submit 이후 다음과 같은 행동도 할 수 있습니다.

```js
<form onSubmit={event => {
  event.preventDefault();
  let data = new FormData(event.target)
  let urlEncoded = new URLSearchParams(data)
  navigate("/create", { state: urlEncoded })
}}>
```

navigate도 Link와 마찬가지로 중첩된 "to" 값으로 작동합니다.

## Data Access

애플리케이션은 전체 UI를 구축하기 위해 React Router에게 몇 가지 정보를 요청할 것입니다. 이를 위해 React Router는 다양한 훅을 제공합니다.

```js
let location = useLocation()
let urlParams = useParams()
let [urlSearchParams] = useSearchParams()
```

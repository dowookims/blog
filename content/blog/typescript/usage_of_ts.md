---
title: 내가 모르고 있던 타입스크립트의 활용
date: "2024-02-04"
tags: [typescript]
description: "타입스크립트의 다양한 활용에 대한 글을 발췌 해 보았습니다."
---

링크드인을 구경하던 도중 지인이 `Matt Pocock` 이라는 분을 팔로우 하고 있었습니다. `Total Typescript` 라는 사이트를 운영하고 있는 분이시며, 타입스크립트 관련된 글을 자주 작성 해 주시는데, 유용하면서 도움이 되었던 글들을 발췌해 보았습니다.

## 1. Optional Methods

JSX를 사용할 때 이벤트 핸들러를 받는 경우 빈번합니다. 저는 이벤트 핸들러를 받을 때 마다 이벤트의 시그니처를 직접 입력었습니다.

```typescript
interface ClickMethods {
    onClick?: (...args): void;
}
```

그런데 아래와 같이 축약된 버전으로 사용할 수 있습니다.

```typescript
interface ClickMethods {
  onClick?(...args: string[]): void;
}
```


```typescript
const Count = ({ onClick }: ClickMethods) => {
  const [count ,setCount] = useState<number>(0)
  const handleOnClick = () => {
    setCount(prev => {
        const next = prev + 1
        onClick?.('user', 'name')
        return next
    })
  }
  return <div onClick={handleOnClick}>{count}</div>;
};
```

## 2. Generic의 활용

JSX에서 하나의 prop에 다른 prop이 의존하게 된다면 제네릭을 활용해서 타입을 추론 할 수 있게 합니다.

```typescript
const Table = <T extends Record<string, unknown>>({
  rows,
  renderRow,
}: {
  rows: T[];
  renderRow: React.FC<T>;
}) => {
  return (
    <table>
      <tbody>{rows.map(renderRow)}</tbody>
    </table>
  );
};
```

---

## 3. as const object로 라우트 타입 만들기

```typescript
const routes = {
  user: ['get-user', 'get-all-users'],
  comment: ['get-comment', 'get-all-comments']
} as const

type Routes = typeof routes

type AuthRoutes = {
  [K in keyof Routes]: `/${K}/${Routes[K][number]}`
}[keyof Routes]

type UserType = 'admin' | 'guest' | 'worker'

type Example = Record<AuthRoutes, UserType[]>
```

---

## 4. infer의 다양한 활용

tailwind 같은 특정 클래스를 강제하고 싶을 때 쓰기 좋은 타입입니다.

```typescript
type InferValueFromColor<Color extends string> = Color extends `${infer N}-${infer C}-${infer T}` ? {
  namespace: N;
  color: C;
  tone: T
} : never
```

```typescript
type Example = InferValueFromColor<'text-green-700'> // { namespace: 'text', color: 'green', tone: '700'}
```

parseInt로 string을 number type으로 변경할 수도 있습니다

```typescript
type ParseInt<T extends string> = T extends `${infer Int extends number}` ? Int : never
```

이렇게 하게 된다면 위에서 정의한

```typescript
type InferValueFromColor<Color extends string> = Color extends `${infer N}-${infer C}-${infer T}` ? {
  namespace: N;
  color: C;
  tone: ParseInt<T>
} : never
```

```typescript
type Example = InferValueFromColor<'text-green-700'> // { namespace: 'text', color: 'green', tone: 700}
```

으로 타입을 사용할 수 있게 됩니다.

---

## 5. indexed array

```typescript
const columns = [
  {
    field: 'notes',
    renderCells: () => 'asd'
  },
  {
    field: 'id',
    renderCells: () => 123
  },
] as const

type Column = (typeof columns)[number]

type ColumnMap = {
  [K in Column as K['field']]: K['renderCells'] 
}
/* 
    ColumnMap = {
        notes: () => string;
        id: () => number;
    }
*/
```



## 출처

[MAPOCOCK 링크드인](https://www.linkedin.com/in/mapocock/)


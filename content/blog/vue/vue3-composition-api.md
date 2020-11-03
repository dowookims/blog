---
title: Vue3 Composition API
date: "2020-11-04"
tags: [vue]
description: "새로나온 Vue3의 Composition API에 대해 알아보자"
thumbnail: ./imgs/vue3-composition-api.png
---

## CompositionAPI는 왜 만들어졌을까

> 결론 : Vue2의 한계를 넘어서기 위해서

Vue component를 만들 때 문제점들과 한계가 있었기에, 이를 극복하기 위해서 만들었습니다. `GREGG POLLACK` 은, Vue component를 생성 할 때 약 3가지의 문제점이 있었다고 합니다.

### 1. 컴포넌트가 커질수록 가독성이 떨어진다

> Large components can become hard to read & maintain

사뭇 당연한 이야기지만, 컴포넌트가 커질수록 컴포넌트에 들어가는 코드의 양이 많아지기 때문에 가독성이 떨어집니다. 이는 유지하기 어려워진다는 결과를 야기하게 됩니다.  

Vue component 내부에는 `props`, `data`, `methods`, `computed`, `lifeCycleMethods` 등 다양한 범위에서 각각의 역할을 수행하는 속성들이 있습니다.  

Vue2를 써보시면 알겠지만, 위의 값과 함수들을 복합적으로 사용하다보면 필연적으로 다양한 속성들을 사용하게 되는데, 이를 확인하기 위해 스크롤의 이동이 빈번히 발생하게 됩니다.  

어떤 값 또는 메소드를 정의 또는 사용하기 위한 코드를 작성할 때 관련된 값들이 일관되며 근처에 있을수록 코드의 가독성이 좋아집니다.

그러나  Vue2의 특성상 컴포넌트가 커질수록 각 속성에 대한 코드의 양이 증가하게 되고, 개발자는 그 특정 속성의 값을 찾기 위해 이리저리 찾아 다니게 되며 이는 결국 유지보수가 어려워진다는 결과를 초래합니다.

그렇기에, Vue3에서는 component의 가독성과 유지보수를 더 좋게 하기 위해서 CompositionAPI를 만들었습니다.

### 2. 재사용 되는 코드 패턴의 문제점

> 컴포넌트 간에 코드를 재사용 하는 완벽한 방법은 존재하지 않습니다.

Vue2에서 코드를 재사용 하기 위해 사용하는 3가지 방법이 있습니다.

#### 1) mixins

`mixins`는 Vue component의 속성들 중, 공통된 속성들을 묶어서 mixin을 만들고, 이를 `mixins`에 배열의 아이템으로 넣어서 사용합니다.  

이 경우에는

1. property 명의 충돌이 발생할 수 있으며
2. 이 mixin들이 어떻게 상호작용 하는지 명확하지 않습니다.
3. 재사용 하기 위해 사용하지만, 재사용 하기 어려워 지곤합니다.

#### 2) mixin factory

mixin factory를 만들어 커스터마이즈된 mixin을 리턴하게 하는 방법입니다.

```js
// @mixins/factories/search.js
export default function searchMixinFactory({...}) {
    return ...
}

// @mixins/factories/sorting.js
export default function sortingMixinFactory({...}) {
    return ...
}

// @components/search.vue

import searchMixinFactory from '@mixins/factories/search';
import sortingMixinFactory from '@mixins/factories/sorting';

export default {
    mixins: [
        searchMixinFactory({
            namespace: 'productionSearch,
        }),
        sortingMixinFactory({
            namespace: 'resultSorting,
        }),
    ]
}
```

이 방법의 경우

* 쉽게 재사용 가능하며
* 관계가 mixin보다 더 명확해 지기는 합니다
* namespacing 컨벤션이 엄격해지며
* 이 mixin이 어떤 값을 가지고 있는지 확인하기 위해 다시 Mixin을 뒤적여야 합니다.
* mixin factory의 경우 동적으로 생성되지 않습니다.

#### 3) scoped slot

```js
// @components/generic-search.vue
<template>
    <div>
        <slot v-bind="{ query, results, run}" />
    </div>
</template>
export default {
    props: ['getResults'],
}

// @components/generic-sorting.vue
<template>
    <div>
        <slot v-bind="{ options, index, output}" />
    </div>
</template>
export default {
    props: ['input', 'options'],
}

// @components/search.vue
<template>
    <GenericSearch
        :get-results="getProduction"
        v-slot="productSearch"
    >
        <GenericSorting
            :input="productSearch.results"
            :options="resultSortingOptions"
            v-slot="resultSorting"
        >
</template>
export default {
    props: ['input', 'options'],
}
```

* 믹스인의 문제점들을 해결할 수 있습니다.
* indent를 증가 시킵니다 => 가독성을 감소시킵니다.
* 프로퍼티 값들을 외부에 노출함으로 유연성이 감소됩니다.
* 하나의 컴포넌트 대신 3개의 컴포넌트를 가짐으로써 효율이 떨어집니다.

이런 문제점들을 해결하기 위해, Vue3에서는 4가지 함수를 제공하여, 이를 활용하여

* 더 적은 코드로
* JS 친화적인 함수로 작성하며
* 위의 3가지 방법보다 더 유연하게 재사용 코드를 작성할 수 있으며
* 자동완성등 tool 친화적입니다.

### 3. 제한된 Typescript 지원

Vue2에서도 typescript를 사용할 수 있었으나, 최적화 되지 않았기 때문에, Vue3에서 typescript 친화적으로 변하게 되었습니다.

## New Features

### 1. setup(props?, context?)

> Vue component가 생성되기 전에 필요한 것들을 setup 한다.

그 결과, Vue3 개발자들은 논리적인 관심사로 코드들을 분리 할 수 있습니다.

```js
export default {
    setup() {

    }
}
```

* optional한 함수입니다.
composition API를 사용할 때 시작점이 되는 함수입니다. 
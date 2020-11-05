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
            namespace: 'productionSearch',
        }),
        sortingMixinFactory({
            namespace: 'resultSorting',
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

<script>
export default {
    props: ['getResults'],
}
</script>

// @components/generic-sorting.vue
<template>
    <div>
        <slot v-bind="{ options, index, output}" ></slot>
    </div>
</template>

<script>
export default {
    props: ['input', 'options'],
}
</script>

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
        ></GenericSorting>
    </GenericSearch>
</template>

<script>
export default {
    props: ['input', 'options'],
}
</script>
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

Composition API는 Vue2의 문제점을 해결하기 위해 등장했습니다. 기존의 Vue2의 문법을 그대로 사용할 수 있으며, Composition API의 경우 반드시 필요한 것은 아닙니다. 위에서 언급했듯이, Composition API를 사용해야 하는 이유는

* Typescript를 지원하기 위해
* 컴포넌트가 너무 커서, feature별로 조직화 될 필요가 있을 때,
* 컴포넌트간 재사용되는 코드가 있을 때

입니다.

### 1. setup(props?, context?)

> Vue component가 생성되기 전에 필요한 것들을 setup 한다.

그 결과, Vue3 개발자들은 논리적인 관심사로 코드들을 분리 할 수 있습니다

```js
export default {
    setup() {

    }
}
```

* optional한 함수입니다. Vue2에서 사용되는 `data`, `computed`, `watch` 등도 계속 사용 할 수 있습니다.
* composition API를 사용할 때 시작점이 되는 함수입니다.
* Components, Props, Data, Methods, Computed Props, Lifecycle methods 이전에 실행됩니다.
* this에 접근 할 수 없습니다.
* 첫번째 인자인 `props`는 reactive 하며, watched 됩니다.
* 두번째 인자인 `context`는 유용한 데이터들의 집합이며, 다음과 같이 데이터에 접근 할 수 있습니다.
  * context.attrs
  * context.slots
  * context.parent
  * context.root
  * context.emit

이 `setup` 함수 내부에 reactive reference를 적용할 수 있습니다.

```js

<template>
    <div>Capacity: {{ capacity }}</div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const capacity = ref(3);
    }
}
</script>
```

#### 1) ref

`ref`는 reactive reference를 만드는 함수 중 하나로, primitive한 데이터를 object로 wrapping하여 변화를 추적할 수 있게 합니다. 기존에 사용하던 `data()` 또한 primitive data를 object로 wrapping 하는 방식으로 사용되었습니다.

> Composition API를 사용하면, component와 연관되지 않는 reactive object를 선언 할 수 있습니다.

`setup`에서 return 한 data들은 template에서 접근 할 수 있습니다. 이렇게 setup을 사용한 방법은 더 장황해 보입니다. 하지만 setup을 활용하여  

* 어떤 것들이 드러나야 하는지 통제할 수 있으며
* property들이 어디에 있는지 더 쉽게 찾을 수 있습니다.

이런 setup의 장점으로 유지보수와 가독성을 높일 수 있습니다.

#### 2) Method

```js

<template>
    <div>
        <p>Capacity: {{ capacity }}</p>
        <button @click="increaseCapacity()" > Increase
        </button>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup () {
        const capacity = ref(3);

        function increaseCapacity() {
            capacity.value++;
        }

        return { capacity, increaseCapacity};
    }
}
</script>
```

위에서 보듯, reactive reference를 변경하는 method의 경우, 일반적인 javascript 함수로 정의하여 이를 반환하여 `template`에서 사용 할 수 있습니다.  

여기서 주의해야 할 점은, `reactive reference`의 경우 object로 wrapping 되기 때문에, object를 증가할 수 없으며, `object.value`로 접근하여 사용해야 합니다.

> 하지만, `template`에서 parsing할 때, `ref`를 사용하는 값이 있다면, 이 `ref`의 `value`를 노출하여 값을 읽게 됩니다.

#### 3) computed

`setup()` 내부에서 정의된 `reactive reference` 를 사용하면서, 이 값들로 어떤 계산된 값, 즉 `computed`와 같은 속성을 사용해야 할 때도 있습니다.

```js

<template>
    <div>
        <p>Left: {{ spacesLeft }} Capacity: {{ capacity }}</p>
        <button @click="increaseCapacity()" >Increase
        </button>
    </div>
    <h2> Attending</h2>
    <ul>
        <li v-for="(name, index) in attending" :key="index">
            {{ name }}
        </li>
    </ul>
</template>

<script>
import { ref, unref, computed } from 'vue'

export default {
    name: 'App2',
    setup () {
        const capacity = ref(3);
        const attending = ref(["mac", "window", "linux"]);
        const spacesLeft = computed(() => {
            return capacity.value - attending.value.length;
        })

        function increaseCapacity() {
            capacity.value++;
        }

        return { capacity, increaseCapacity, attending, spacesLeft};
    },
    mounted() {
        console.log(unref(this.attending));
    },
}
</script>
```

위의 코드처럼, `computed` 함수를 import 하고, computed 함수 내부에 콜백 함수를 작성하여 계산된 값을 return 하면, `computed` 에 정의 한 것 처럼 사용 할 수 있습니다.

#### 4) reactive

`ref` 이외에도 primitive data를 object로 wrapping하는 함수가 있습니다. `reactive`라는 함수입니다.

```js

<template>
    <div>
        <p>Left: {{ event.spacesLeft }} Capacity: {{ event.capacity }}</p>
        <button @click="increaseCapacity()" >Increase
        </button>
    </div>
    <h2> Attending</h2>
    <ul>
        <li v-for="(name, index) in event.attending" :key="index">
            {{ name }}
        </li>
    </ul>
</template>

<script>
import { ref, unref, computed, reactive } from 'vue'

export default {
    name: 'App2',
    setup () {
        const event = reactive({
            capacity: 3,
            attending: ["mac", "window", "linux"],
            spacesLeft: computed(() => {
                return event.capacity - event.attending.length;
            })
        })

        function increaseCapacity() {
            event.capacity.value++;
        }

        return { event, increaseCapacity};
    },
    mounted() {
        console.log(unref(this.attending));
    },
}
</script>
```

이 reactive 함수는 이전에 사용하던 `data()` 옵션과 비슷합니다. 이 `reactive`를 사용함으로써, computed를 사용한 변수를 `object` 내부로 넣을 수 있으며, `ref` 처럼 값에 접근 할 때, `.value`로 접근하지 않아도 된다는 장점이 있습니다.

그러나, 이렇게 reactive로 object를 만든다음, 이를 return 할 때 귀찮은 일들이 생기는데요, 이 값들을 사용할 때, `event.name` 으로 접근해야 합니다. 사람마다 다를수는 있으나, 일반적으로 객체의 프로퍼티로 접근하는게 가독성이 떨어질 수 있습니다.

이를 해결하기 위해, destructuring을 할 수 있으면 좋을텐데요,

```js
return { ...event, increaseCapacity };
```

에서 `...event`의 경우 destructuring을 사용해서 reactivity를 깨게 됩닏다. 이를 방지하기 위해, 새로운 함수인 `toRef` 또는 `toRefs`를 사용할 수 있습니다.

```js
return { ...toRefs(event), increaseCapacity };
```

`toRef` 는 `reactive` 객체의 하나의 property를 `ref` 를 활용하여 wrapping 하는 함수입니다.

```js
const state = reactive({
    foo:1,
    bar:2
})

const fooRef = toReef(state, 'foo')

fooRef.value++;
console.log(state.foo) // 2

state.foo++
consolee.log(fooRef.value) // 3
```

`toRefs`는 `reactive object`를 plain object로 변환시킵니다. 이 `plain object` 내부의 프로퍼티들을 `ref` 가 적용되어 있기 때문에, 기존의 `reactive object`를 가리키며 사용 할 수 있습니다.

```js
const state = reactive({
    foo: 1,
    bar: 2
})

const stateAsRefs = toRefs(state)
/* 
Type of stateAsRefs
{
    foo: Ref<numbmer>,
    bar: Ref<number>
}
*/

state.foo++
console.log(stateAsRefs.foo.value) // 2
stateAsRefs.foo.value++
console.log(state.foo) // 3
```

### 2. Modularizing

Vue2의 한계점 중 하나인, 코드 재사용에서의 문제점이 있었습니다. 이를 해결하는 방법으로 `setUp()`이 사용되기도 합니다.

```javascript

<template>
    // ...
</template>

<script>
// @use/event-space.vue

import { ref, computed } from "vue";

export function useEventSpace() {
    const capacity = ref(4);
    const attending = ref(["Tim", "Bob", "Joe"]);
    const spacesLeft = computed(() => {
    return capacity.value - attending.value.length;
    });
    function increaseCapacity() {
    capacity.value++;
    }
    return { capacity, attending, spacesLeft, increaseCapacity };
}
</script>
```

재사용할 setup 함수를 다른 파일로 빼서, 정의 해두고

```js
<template>
    // ...
</template>
<script>
import useEventSpace from "@/use/event-space";
export default {
    setup() {
        return useEventSpace();
    }
};
</script>
```

```js
<template>
    //  ...
</template>
<script>
import useEventSpace from "@/use/event-space";
import useMapping from "@/use/mapping";
export default {
    setup() {
    return { ...useEventSpace(), ...useMapping() }
    }
};
</script>
```

위처럼 import 해서 `setup` 에서 return에 사용할 수 있습니다.

그러나 이처럼 사용할 경우에, 기존 `mixins`와 차이가 없습니다. mixin의 경우 어떤 데이터가 사용되는지 확인하려면 해당되는 mixin 파일에서 값을 확인해야 합니다.  

 이를 극복하기 위해, Vue3는 `destructuring`을 활용하여 해결책을 만들었습니다.

```js
<template>
    // ...
</template>
<script>
import useEventSpace from "@/use/event-space";
import useMapping from "@/use/mapping";
export default {
    setup() {
        const { capacity, attending, spacesLeft, increaseCapacity } = useEventSpace();
        const { map, embedId } = useMapping();

        return { capacity, attending, spacesLeft, increaseCapacity, map, embedId };
    }
};
</script>
```

이렇게 작업하니 어떤 값들이 정의되고 사용되는지 더 직관적으로 확인 할 수 있습니다. Vue3에서는 composition API를 재사용 할 때 위처럼 사용하는 것을 **권장**하고 있습니다.

### 3. Lifecycle methods

**new methods**

* **onRenderTracked**
  
  reactivity dependency가 render 함수에 처음 접근했을 때 호출되는 라이프 사이클 메서드입니다. reactive dependency 는 추적 가능해지며, 디버깅 할 때 유용하게 사용 할 수 있습니다.

* **onRenderTriggered** 

  새로운 렌더가 트리거 될때, 어떤 dependency가 컴포넌트를 리렌더링 하는지 검사할 수 있게 하는 라이프 사이클 메서드 입니다.

**naming change**

* beforeDestroy() => beforeUnmount()
* destroyed() => unmounted()

**lifecycle methods in setup**

접두사 on을 붙여서 사용

* onBeforeMount
* onMounted
* onBeforeUpdate
* onUpdated
* onBeforeUnmount
* onUnmounted
* onActivated
* onDeactivated
* onErrorCaptured

> beforeCreate, created는 사용되지 않는데, beforeCreate이 setup보다 먼저 실행되기 때문입니다. 그리고, setup 실행 이후 created가 실행 됩니다.

### 4. Watch

#### 1) watchEffect

```js
<template>
  <div>
    Search for <input v-model="searchInput" /> 
    <div>
      <p>Number of events: {{ results }}</p>
    </div>
  </div>
</template>
<script>
import { ref } from "@vue/composition-api";
import eventApi from "@/api/event.js";

export default {
  setup() {
    const searchInput = ref("");
    const results = ref(0);
    
    results.value = eventApi.getEventCount(searchInput.value);

    return { searchInput, results };
  }
};
</script>
```

이 코드의 경우, `input`에 어떤 값을 입력하여도, results 값은 변하지 않습니다. setup에서 정의된 results의 값을 변경하는 것은 한번만 실행 되기 때문입니다. 이와 같은 문제를 우리는 Vue2에서 `watch` 메서드를 통해 해결했습니다.

이와 똑같이, setup에서도 `watch`와 관련된 함수로 위의 문제를 해결 할 수 있습니다.

```js
setup() {
  const searchInput = ref("");
  const results = ref(0);

  watchEffect(() => {
    results.value = eventApi.getEventCount(searchInput.value);
  });

  return { searchInput, results };
}
```

이 `watchEffect` 함수는 dependency의 reactivity를 추적하고, dependency가 수정 되었을 때 그 다음 tick(next tick)에 내부 콜백 함수를 다시 실행하는 역할을 수행합니다.

#### 2) watch

watch는 `watch` property와 동일한 역할을 수행합니다. 이 watch가 `setup` 내부에 들어갔다는 차이만 있을 뿐입니다.

watch API는 어떤 요소에 대해 구체적인 변화를 감지하고자 할 때 사용합니다.

```js
watch(searchInput, () => {
    ...
})
```

또한, 새로운 값과 기존 값을 확인하기 위해, 두번 째 인자인 콜백함수에 인자들을 넣어서 확인 할 수 있습니다.

```js
watch(searchInput, (newVal, oldVal) => {
    ...
})
```

여러개의 reactive reference를 비교하기 위해서 다음과 같이 사용 할 수도 있습니다.

```js
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  ...   
});
```
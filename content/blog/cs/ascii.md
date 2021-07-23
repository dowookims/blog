---
title: CS50 - ASCII
date: "2020-10-19"
tags: [cs50, ascii]
description: "CS50에서 ASCII에 대해 나온 내용 및 꼬리 질문들을 정리합니다."
thumbnail: ./imgs/cs50-hardware.png
---

## 1. ASCII란

ASCII(American Standard Code for Information Interchange, 미국 정보 교환 표준 부호) 코드는 문자를 컴퓨터가 이해할 수 있는 binary data로 혹은 그 반대로 변환하는 표준 방법입니다.

## 2. ASCII 인코딩 표준

ASCII는 컴퓨터가 텍스트 데이터를 저장하기 위해 흔히 사용하는 표준코드체계 입니다. 이 표준에서는 `65(A) -90(Z)`, `97(a) - 122(z)` 로 표현이 되며, 이 10진법 수를 2진법 수로 표현하여 데이터를 표시합니다. 여기서, A와 a는 32bit(2^5bit) 차이가 납니다.  

![아스키코드표](https://ww.namu.la/s/05acaba21abdca4ab79fdc7a1c604e2535b074bbe37a51181d89120499081e0d19000a106a7c96c99bebf82bc785f0e8ff45a98a32493cef61ba8722acef83474e4c89077ff56eb6ce83bcc59d07d19e65abb730004f43f1404d269c02a1ecdd)

## 3. ASCII의 한계

ASCII는 ASCII코드표로 나타내며, ASCII코드 표는 모든 ASCII 코드 문자와, 그에 대응하는 숫자를 보여줍니다. 기본 ASCII 코드 표는 `7bit`로 모든 문자를 표현하는데 총 128개의 문자를 나타낼 수 있습니다.  

**확장ASCII**는 8번째 비트를 추가하여 총 256개의 문자를 나타낼 수 있도록 합니다. 그러나 소문자 대문자 통틀어 52개의 알파벳 밖에 없으므로 그 외 남는 공간에 구분 기호, 숫자, 몇몇 기본 심볼($, % 등) 같은 다른 종류의 문자들을 나타낼 수 있습니다.  

그러나, 8비트 ASCII 코드로도 나타낼 수 없는 문자들이 많기 때문에, 이들을 다루기 위해 유니코드(Unicode)가 생기게 되었습니다. 유니코드의 첫 128개의 문자는 ASCII의 128개 문자와 동일하므로 서로 호환이 됩니다.  

ASCII 코드가 7비트만 사용하는 이유는, 나머지 1비트를 통신 에러 검출을 위해 사용이 되기 때문입니다. `Parity Bit`라 불리는, 7개의 비트 중 1의 개수가 홀수면 1, 짝수면 0으로 하는 식의 패리티 비트를 붙여, 전송 도중 신호 변질을 수신 측에서 검출해낼 확률을 높인 것 입니다. 그러나 이런 체크에 검출되지 않는 신호 에러도 많이 발생되기 때문에 현재는 더 이상 쓰이지 않으며 현재는 8비트 문자 인코딩에서 맨 앞 비트에 0을 붙이고 이어지는 7비트를 사용하는 식의 인코딩이 일반적 입니다.

## 4. base64 인코딩

webpack을 사용하다보면, url-loader가 용량이 작은 이미지의 경우, DataURIScheme을 통해 이미지 데이터를 base-64로 인코딩하여 이미지를 복사하지 않고 번들 파일에 넣는 역할을 합니다. 이런 Data URI Scheme을 사용하면 외부 데이터를 파일 형태로 저장하지 않고 사용 가능하기 때문에 파일의 호출이 줄어듦으로써 빠른 전송이 가능하나, base64 인코딩이 내부 로직에 의해 추가 용량을 잡아먹기 때문에 IMG 파일의 용량이 작은 경우에 주로 사용합니다.

base64는 바이너리 데이터를 문자 코드에 영향을 받지 않는 공통 ASCII 문자로 표현하기 위해 만들어진 인코딩 방법입니다. ASCII 문자 하나하나가 64진법의 숫자 하나를 의미하기에 64(2^6)이라는 이름을 가지게 되었습니다.

![base64](https://cdn-images-1.medium.com/max/1600/1*jU2iAYGT1FuHN597AiIMuw.png)

DOU는 아스키 코드로 D(68) O(79) U(85)의 값을 가지며 이를 이진법으로 표현하면

01000100 01001111 01010101 이며, base64가 2^6, 6bit를 사용하기 때문에

010001 000100 111101 / 010101 padding padding
R(17) E(4) 9(61) V(21) , RE9V로 표현됩니다.

그러나, 8bit로 이루어진 ASCII를 6비트 표현인 base64로 인코딩을 하게 된다면 6과 8의 최소공배수인 24 bit, 3byte로 끊어서 표기를 해야하는데, 위의 **padding** 이라고 표기된 부분처럼 공백의 부분이 생기게 되며, 이 부분에는 padding 문자를 넣어주게 되는데, 이 때 사용되는 패딩 문자는 `=` 입니다.  

즉, DOU를 base64로 최종 인코딩한 결과는 `RE9V==`가 됩니다. 여기서 보다시피, 6bit당 2bit의 OverHead가 발생되기 때문에, 용량이 큰 이미지의 경우 url-loader로 DataURIScheme을 사용하지 않는게 좋다고 이야기 합니다.

### 그런데도 왜 base64를 사용하는가

문자를 전송하기 위해 설계된 Media(Email, HTML) 등을 이용해 플랫폼 독립적으로 Binaray Data(이미지, 오디오)를 전송 할 필요가 있을 때, ASCII로 Encoding 할 경우 여러가지 문제가 발생할 수 있는데 대표적인 문제는

* ASCII는 7 bit Encoding인데 나머지 1bit을 처리하는 방식이 시스템 별로 상이하다.
* 일부 제어문자(Line ending)의 경우 시스템 별로 다른 코드값을 갖는다.

등과 같은 문제로 ASCII는 시스템간 데이터를 전달하기에 안전하지 않기 때문에, BASE64는 ASCII중 제어문자와 일부 특수문자를 제외한 64개의 안전한 출력 문자를 사용합니다.

> 즉,  Base64는 HTML, Email 등 문자를 위한 Media에 Binary 데이터를 포함해야 될 필요가 있을 때, 포함된 Binary Data가 시스템 독립적으로 동일하게 전송 또는 저장되는걸 보장하기 위해 사용합니다.

## 참조

[부스트캠프-cs50-ascii](https://www.edwith.org/cs50/lecture/22807/)  
[base64 - 코딩하는오징어](https://effectivesquid.tistory.com/entry/Base64-%EC%9D%B8%EC%BD%94%EB%94%A9%EC%9D%B4%EB%9E%80)
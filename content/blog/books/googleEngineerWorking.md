---
title: 구글 엔지니어는 이렇게 일한다
date: "2022-05-26"
tags: [books, 구글 엔지니어는 이렇게 일한다]
description: "구글 엔지니어가 일하는 모습을 보고 조금이라도 내 일터를 개선해Boza"
thumbnail: ./imgs/google_engine.jpg
---

## 0. 들어가기에 앞서

한빛미디어 <나는 리뷰어다> 활동을 위해서 책을 제공받아 작성된 서평입니다.

> 제목 : 구글 엔지니어는 이렇게 일한다
> 저자 : 타이터스 윈터스 , 톰 맨쉬렉 , 하이럼 라이트
> 번역 : 개앞맵시(이복연)
> 출판사 : 한빛 미디어  
> 초판 발행 : 2022년 5월 10일
> 페이지 : 704

---

## 1. TL;DR

- 모든 문제를 해결 해 주는 요술 망치는 없다.
- 우리는 한정된 자원 안에서 비용과 효과, 사이드 이펙트를 고려하여 일들을 해야 한다.
- 소프트웨어 엔지니어링과 프로그래밍의 차이는 시간의 연속성에 존재한다.
- 위 상황에서 우리는 적절한 답을 어떻게 찾을 수 있을까? 에 대한 내용이 포함되어 있습니다.
- 예상 독자
  - IT 조직 내에 있는 구성원 전부
  - IT 조직을 접해보지 않은 사람들이 읽기에는 공감되는 부분이 적을 수 있습니다.
- 이 책의 내용을 모두 받아들일 필요는 없습니다. 각 조직의 환경, 문화, 구성원 수에 따라 적합한 방법을 선택할 수 있으며 여기에 나와 있는 내용들은 우리에게 닥칠, 우리가 이미 직면한 문제들에 대해 다시금 화두를 던지는 내용들 일 수 있습니다.

---

## 2. 이 책을 선택한 이유

주니어 개발자 이지만, 소규모 팀을 이끌게 되었습니다.

그리고 저 또한 저희 회사 조직 내에 작은 직원으로서, 프론트엔드 개발자로서 어떤 방향으로, 방식으로 조직이 변화해야 할 지에 대해 전혀 모르고 있었습니다.

사람들이 많아지고, 조직이 커질수록 "프로세스가 생겼으면 좋겠다." 라고 생각했지만, 실제로 어떤 방향으로 프로세스가 생겨야 하는지에 대해서는 고민해 본 적이 없습니다.

어찌보면 시니어 및 경영진 측에 프로세스 구축이라는 과제를 던져주고, 해달라고 요청만 하고 있는 상황이었지요.

이제 저 또한 한 조직의 장으로써(소규모 팀이지만) 이 팀의 방향성 및 절차에 대해 고민해 보게 되었습니다.

어떤 방식과 절차들을 구축해야 하는지, 그 안에서 내가 / 우리팀이 / 회사가 원하는 방향은 어떤것이며 이를 달성하기 위한 목표와 근거, 그리고 그안에서 지켜야 할 것들과 피해야 하는 것들에 대해 조금더 알아보기 위해 이 책을 선택했습니다.

---

## 3. 리뷰

이 책의 목차는

1. 전제
2. 문화
3. 프로세스
4. 도구

이렇게 구성되어 있습니다.

책 제목에서 나와 있듯이, `엔지니어` 들이 일하는 방식에 대해 논의하기 전에 이 **소프트웨어 엔지니어링** 라는 용어에 대해서 정의하고 있습니다.

`소프트웨어 엔지니어링은 무엇일까?` 라는 것에 대한 질문을 살면서 해본적이 없습니다.

그렇다면 `프로그래밍` 은 무엇일까요 ?

`소프트웨어 엔지니어링` 과 `프로그래밍` 이라는 것은 어떤 차이가 있을까요?

참으로 심오한 소재라고 생각합니다. 전혀 이부분에 대해 생각해 본 적이 없었기 때문에, 그냥 말장난이 아닌가 라고 생각을 했습니다. 여기서 저자는 다음과 같이 이야기 하는데요,

> 구글에서는 "소프트웨어 엔지니어링은 흐르는 시간 위에서 순간순간의 프로그래밍을 모두 합산한 것이다" 라고 말하곤 합니다.

라는 말이 있습니다. 소프트웨어 엔지니어링에서 프로그래밍이 큰 비중을 차지하지만, 결국 프로그래밍은 **새로운 소프트웨어를 제작하는 수단**이라는 말이지요.

소프트웨어 엔지니어로서 개발 할 때, 제가 맡은 업무에 대해 어떻게 구조를 잡고, 어떤 방식으로 문제를 해결 할 지에 대한 고민만 했었습니다.

그렇기에, 내가 작성한 코드가 얼마나 오래 살아 숨쉴 것이며 내가 담당하고 있는 소프트웨어가 비즈니스 적으로 얼마나 오래 갈 것인지, 그 기간동안 이 코드가 변경될 여지가 있는지에 대한 고민 자체를 해본적이 없습니다.

책의 저자는 이런 화두를 계속 던집니다.

- 당신이 맡은 소프트웨어의 영속성은 얼마나 되는가?
- 여기서 당신에게 주어진 자원과 비용은 어떻게 되는가?
- 그 안에서 당신은 어떤 스탠스를 취해야 하는가?
- 모든 문제를 해결 할 수 있는 은탄은 존재하지 않는다. 이런 순간 순간 선택의 상황에서 당신은 어떤 선택을 할 것인가?

위와 같은 맥락으로, 소프트웨어 엔지니어링은 하나의 목표인 성공적인 소프트웨어 개발 및 운영이라는 측면에서 팀 스포츠와 같다고 이야기 합니다.

한명이 잠깐의 코딩으로 이루어지는 것이 아닌 여러 사람들이 모여서 팀 스포츠를 하며 하나의 목표를 이루기 위해, 그 목표를 이루고 나서 행해지는 모든 것들에 대해 고민을 해 봐야 합니다.

그렇기에 이 책에서는 목차의 첫번째로 전제를 둔 것 같습니다. 책의 독자들이 놓여진 환경에 대한 명확한 정의를 하기 위해 `전제`를 두어 자신들의 문제 상황에 대해 정의를 하고,

문제 상황에 대한 해결 요소로써 필요한 것들이 문화, 프로세스, 도구 이 세가지 측면에서 고려를 해야 한다고 말하고 있습니다.

그렇기에 현재 처한 상황을 문제 상황으로 정의를 하고, 이를 해결하기 위한 방법들을 하나하나 고려해 본다는 생각으로 책을 읽어 보는 것을 추천합니다.

이 책 안에 있는 내용들이 반드시 정답이 될 거라는 보장은 없습니다. 맞는 부분도 있을 것이며, 맞지 않는 부분들도 있을 겁니다. 하지만 이 책이 저에게 주는 가장 큰 울림은 고민해보지 못한 질문들을 계속 던진다는 것 이었습니다.

아마 개발자로 일하는 동안 옆에 두면서 틈틈히 조직 문화 및 팀에 대해 고민이 있을 때 마다 보게 되는 책이 될 것 같습니다.

---

## 4. 총평

- 실제 코드 및 디자인 패턴 등 코딩에 대한 직접적인 내용은 등장하지 않습니다.
- 지표와 그림 및 그래프 등, 내용을 설명하기 위한 보조 자료 들이 적절히 들어가 있습니다.
- 이 책은 처음부터 끝까지 정독하는 책은 아닌 것 같습니다. 필요한 부분만 발췌독 하시되, 서론 및 전제 부분의 경우는 반드시 읽는 것을 추천합니다.
- 생각할 내용이 많은 책이고, 많은 것들을 생각하다 보면 이전에 내용이 뭐가 있더라... 라는 생각이 들 수 있습니다

---
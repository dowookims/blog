---
title: (도서서평) 러스트 동시성 프로그래밍
date: "2024-02-25"
tags: ["책", "러스트", "도서서평", "동시성 프로그래밍"]
description: "러스트 동시성 프로그래밍을 읽고 작성한 독서 서평 입니다."
thumbnail: ./imgs/rust.jpg
---

## 0. 들어가기에 앞서

한빛미디어 <나는 리뷰어다> 활동을 위해서 책을 제공받아 작성된 서평입니다.

> 제목 : 러스트 동시성 프로그래밍  
> 저자 : 마라 보스  
> 번역 : 윤인도  
> 출판사 : 한빛미디어  
> 초판 발행 : 2024년 1월 19일  
> 페이지 : 280

---

## 1. 이 책을 선택한 이유

요즘 프론트엔드 개발 도구들이 rust로 다시 쓰여지고 있습니다. Web Assembly 뿐만 아니라 프론트엔드 도구도 rust를 사용하고 있기에 이참에 러스트를 배워보자! 라는 마음으로 올 해 러스트를 공부하고 있고, 추가적인 공부를 위해 이 책을 선택하게 되었습니다.

---

## 2. 예상 독자

개발을 갓 입문하신 분들, 러스트 입문자에게는 비추천 합니다. 러스트의 기본 문법을 알려주는 책이 아니기 때문에 어느 정도 러스트 코드를 읽고, 소유권 등에 대한 개념이 있으시면 읽기에 수월할 것이라 생각합니다.

---

## 3. 목차

1. 러스트 동시성의 기초

2. 아토믹

3. 메모리 순서

4. 스핀 락 구현해보기

5. 채널 구현해보기

6. Arc 구현해보기

7. 프로세서 이해하기

8. 운영체제의 기본 요소

9. 잠금 구현해보기

10. 아이디어와 제안

---

## 4. 리뷰

한빛미디어 홈페이지에서 이 책을 검색하게 되면 해설 영상과 함께 학습하는 영상이 있습니다.  
**[Rust Atomics and Locks 같이 읽기: playlist 소개](https://www.youtube.com/watch?v=GX2hLeWVy0M)**

AI 인가? 싶었는데 한국어를 너무 잘하시는 외국인 분이 만드신 강의었습니다. 외국인이 한국어로 리딩해주는 독특한 경험이 있으니 책과 함께 같이 학습 하시면 좋을 것 같습니다.

저수준 동시성에 대한 깊은 이해를 바라시는 분들이 읽기에 좋은 책입니다. 러스트의 저수준 동시성에 대한 기본 개념부터 체계적으로 작성되어 있습니다. 예를 들어, 쓰레드 부터 시작해서 RC(Reference Counter), Arc 순으로 학습을 하게 되며 그안에서의 장단점을 학습할 수 있게 됩니다.

예제를 통해 학습할 수 있는 구조가 좋았습니다. 특히 메모리와 운영체제에 대한 코드들을 학습해 보고, Rust standard library등을 직접 구현하는 경험을 통해 TODO 수준이 아닌 그 이상의 경험을 해 볼 수 있는 책이었습니다.

아직 러스트에 대한 조예가 깊지 않아, 그리고 OS와 컴퓨터 구조에 대한 지식이 짧아 모든 것들을 다 흡수하지는 못했지만, 꼭꼭 씹어가며 이해할 수 있는 내용이 많아 좋았습니다.

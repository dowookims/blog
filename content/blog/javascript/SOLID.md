---
title: 객체지향 설계원칙 SOLID
date: "2020-09-10"
tags: [javascript]
description: "SOLID에 대해 알아보자"
thumbnail: ./imgs/datatype.png
---

* `S`ingle Responsibility Principle (단일 책임 원칙)
* `O`pen/Closed Principle (개방 / 폐쇄 원칙)
* `L`iskov Substitution Principle (리스코프 치환 원칙)
* `I`nterface Segregation Principle (인터페이스 분리 원칙)
* `D`ependency Inversion Principle (의존성 역전 원칙)

## 단일 책임 원칙

> 객체는 단 한개의 책임(역할)을 가져야 하며, 객체를 변경해야 하는 이유는 단 하나여야 한다.

> 모든 함수, 메서드는 반드시 한 가지의 변경 사유만 있어야 한다.

## 개방 폐쇄의 원칙

> 모든 소프트웨어 개체는 확장 가능성은 열어 두되 수정 가능성은 닫아야 한다.

> 상속 및 다양한 방법으로 재사용하고 확장하라.

## 리스코프 치환 원칙

> 어떤 타입에서 파생된 타입의 객체가 있다면, 이 타입을 사용하는 코드는 변경하지 말아야 한다.

## 인터페이스 분리 원칙

> 클라이언트가 자신이 이용하지 않는 메서드에 의존하지 않아야 한다

## 의존성 역전 원칙

> 상위 수준 모듈은 하위 수쥰 모듈에 의존해서는 안되며 이 둘은 추상화에 의존해야 한다.

SOLID원칙에 대한 정의에 대해 알아봤는데, 이 내용에 대한 설명은 너무 방대하기 때문에 천천히 정리하도록 하겠습니다.
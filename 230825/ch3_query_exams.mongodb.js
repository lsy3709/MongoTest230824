// 데이터베이스에 연결하는 의미.
// 자동차 관련 공공데이터 사용.
// 교재: 맛있는 몽고 디비 , 저자 정승호
// 제공 , json 파일 임포트 하고 , 진행.
// 전체 실행 단축키 : ctrl + alt + r
// 문장 실행 단축키 : ctrl + alt + s
use("car_accident");
// _id -> 기본값이고(별개), 따로 설정 없으면 무조건 보이고, 따로 false 또는(=0)
//교차로내.accident_count 하나 보여주고, 나머지 전부다 안볼거예요.
db.by_road_type.find(
  { county: "강릉시" }, // 쿼리 부분: 조건
  { _id: false, "교차로내.accident_count": 1 } // 프로젝션 : 보고 싶은 열 선택.
);
use("car_accident");
// 하나 문서의 갯수를 구하는 함수 예제.
db.by_road_type.countDocuments({ county: "강릉시" });

use("car_accident");
db.by_road_type.find(
  { "기타단일로.death_toll": 0 }, // 쿼리, 조건문
  { _id: false, city_or_province: true, county: 1 } // 프로젝션 , 보고싶은 열
);

use("car_accident");
db.by_road_type.find(
  { "횡단보도부근.death_toll": 0 }, // 쿼리, 조건문
  { _id: false, city_or_province: true, county: 1 } // 프로젝션 , 보고싶은 열
);
//샘플 디비 입력
use("car_accident");
db.inventory.insertMany([
  { item: "journal", qty: 25, tags: ["blank", "red"] },
  { item: "notebook", qty: 50, tags: ["red", "blank"] },
  { item: "paper", qty: 100, tags: ["red", "blank", "green"] },
  { item: "planner", qty: 75, tags: ["blank", "red"] },
  { item: "postcard", qty: 45, tags: ["blue"] },
]);

// 전체 다 보여주세요. 쿼리생략, 프로젝션 생략.
db.inventory.find();
//논리, 비교 연사자 , 쿼리 -> 조회식 한줄씩 드래그 후 : ctrl + alt + s : 한줄 실행.
//문법
// db.inventory.find(
//     {  <filter> : { <operator> : <value> }      }
//       )
db.inventory.find({ item: { $eq: "journal" } });
db.inventory.find({ item: "journal" });
// in
db.inventory.find({ tags: { $in: ["red"] } });
// $regex 연산자
// {<field> : { $regex : /pattern/, $options : '<options>'}}
// {<field> : { $regex : 'pattern', $options : '<options>'}}
// {<field> : { $regex : /pattern/<options>}}
db.inventory.find({ tags: { $in: [/^[a-z]*d/] } });
db.inventory.find({ tags: { $in: [/^b/] } });
db.inventory.find({ tags: { $in: [/^g/] } });
db.inventory.find({ item: /^p/i });
//nin
db.inventory.find({ tags: { $nin: ["blank", "blue"] } }); //없음
db.inventory.find({ tags: { $nin: ["blank"] } }); //1개
// gt, lte
db.inventory.find({ qty: { $not: { $gt: 50 } } });
db.inventory.find({ qty: { $lte: 50 } });
//수량 구하기.
db.inventory.countDocuments({ qty: { $lte: 50 } });
db.inventory.find({ $or: [{ qty: { $gt: 90 } }, { qty: { $lt: 50 } }] });
db.inventory.find({ $and: [{ qty: { $gt: 50 } }, { qty: { $lt: 90 } }] });
db.inventory.find({ qty: { $gt: 50, $lt: 90 } });
// tags에 red가 들어간 도큐먼트 전부 출력
db.inventory.find({ tags: "red" });
// tags가 "red", "blank" 둘 다 주어진 순서대로 가진 도큐먼트 전부 출력
db.inventory.find({ tags: ["red", "blank"] });

//실습3
db.stores.insertMany([
  { _id: 1, name: "Java Hut", description: "Coffee and cakes" },
  { _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
  { _id: 3, name: "Coffee Shop", description: "Just coffee" },
  { _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" },
  { _id: 5, name: "Java Shopping", description: "Indonesian goods" },
]);
//Text index -> 4장 인덱스
db.stores.createIndex({ name: "text", description: "text" });
//$text Operation -> 문자열 검색
db.stores.find({ $text: { $search: "java coffee shop" } });
db.stores.find({ $text: { $search: "shopping" } });
//exact Phrase : 정확하게 일치하는 문서 찾기
db.stores.find({ $text: { $search: '"coffee shop"' } });
// Term Exclustion : "-"연산자를 사용하여 검색에 제외할 텀을 지정
db.stores.find({ $text: { $search: "java shop -coffee" } });
db.stores.find({ $text: { $search: "java -shop -coffee" } });
db.stores.find({ $text: { $search: "java -shop" } });
//
db.stores
  .find(
    { $text: { $search: "java coffee shop" } },
    //$meta 연산자를 사용하는 score 필드를 포함. 이 필드에는 각 문서의 텍스트 검색 점수가 보관됩니다.
    { score: { $meta: "textScore" } }
    //score 필드(텍스트 검색 점수)를 기준으로 내림차순으로 결과를 정렬
  )
  .sort({ score: { $meta: "textScore" } });

//  $all 순서와 상관없이 있으면 선택
//  $elemMatch 조건과 맞는 배열 속 요소를 가진 것을 선택
//  $size 해당 배열의 크기와 같은 것 선택
db.inventory.find({ tags: { $gt: 10, $lt: 5 } });
db.inventory.find({ tags: { $elemMatch: { $gt: 10, $lt: 5 } } });
db.by_month.find({
  $and: [
    { month_data: { $elemMatch: { month: "01월", heavy_injury: 0 } } },
    { month_data: { $elemMatch: { month: "02월", death_toll: 0 } } },
  ],
});
//$size
db.inventory.find({ tags: { $size: 3 } }); //배열 lenth가 3인 문서
//  프로젝션 연산자의 역할
// 특정 필드만 가져옴
// $slice : 배열 필드에 주어진 범위 $elemMatch 배열 필드의 조건에 맞는 것만
// $ 첫번째 요소만
use("car_accident");
db.people.insertMany([
  { name: { first: "철수", last: "김" } },
  { name: { first: "영희", last: "김" } },
  { name: { first: "수영", last: "박" } },
  { name: { first: "희영", last: "이" } },
]);
db.people.insertOne({ name: { first: "철수", last: "김" } });
db.people.deleteOne({ "name.first": "철수" });
db.people.find({}, { "name.first": 1 });
// {item: "book", tags: ["red", "blank"]}
// 잘못됨. tags의 첫번째 인자[0]가 아니라 tags 배열의 0이란 원소를 출력하라는 의미
db.inventory.find({}, { "tags.0": 1 });
// tags 배열의 [0], [1]을 출력하라 (앞에서 부터 2개를 출력하라)
db.inventory.find({}, { tags: { $slice: 2 } });
// tags 배열의 [2:3] 을 출력하라, 끝자리 미포함,
db.inventory.find({}, { tags: { $slice: [1, 3] } });
// $elemMatch
//  $ 연산자
// #특정 조건에 부합하는 필드만 출력하라
db.inventory.find({}, { tags: { $elemMatch: { $regex: /^b/ } } });
//#특정 조건에 부합하는 첫번째 데이터만 출력하라
// 방금 검색한 필드의 값중 "red"를 갖는 도큐먼트를 찾음.
db.inventory.find({ tags: "red" }, { _id: false, item: false, qty: false });
db.inventory.find({ tags: "red" }, { "tags.$": true });

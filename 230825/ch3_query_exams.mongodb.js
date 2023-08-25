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
// 갯수
db.inventory.countDocuments({ tags: { $in: ["red"] } });
// $regex 연산자
// {<field> : { $regex : /pattern/, $options : '<options>'}}
// {<field> : { $regex : 'pattern', $options : '<options>'}}
// {<field> : { $regex : /pattern/<options>}}
// 시작은 알파벳으로 시작이고 갯수 0문자이상, 끝나는 문자 d로 끝나는 문자열 검색.
db.inventory.find({ tags: { $in: [/^[a-z]*d/] } });
// b로 시작하는 단어 검색.
db.inventory.find({ tags: { $in: [/^b/] } });
// g로 시작하는 단어 검색.
db.inventory.find({ tags: { $in: [/^g/] } });
// p로 시작하는 단어 검색.
// regex ex) ^(p)*[a-z]*(e)
//: p로 시작하고  0개이상, a-z 중한문자 갯수 0개이상
// 끝나는 문자 e
db.inventory.find({ item: /^p/i });
//nin
db.inventory.find({ tags: { $nin: ["blank", "blue"] } }); //없음
db.inventory.find({ tags: { $nin: ["blank"] } }); //1개
// gt, lte
db.inventory.find({ qty: { $not: { $gt: 50 } } });
db.inventory.find({ qty: { $lte: 50 } });
//수량 구하기.
db.inventory.countDocuments({ qty: { $lte: 50 } });

// 논리 연산자를 사용하는 형식이 다른 부분. 체크.
db.inventory.find({ $or: [{ qty: { $gt: 90 } }, { qty: { $lt: 50 } }] });
db.inventory.find({ $and: [{ qty: { $gt: 50 } }, { qty: { $lt: 90 } }] });
db.inventory.find({ qty: { $gt: 50, $lt: 90 } });
// tags에 red가 들어간 도큐먼트 전부 출력
db.inventory.find({ tags: "red" });
// tags가 "red", "blank" 둘 다 주어진 순서대로 가진 도큐먼트 전부 출력
db.inventory.find({ tags: ["red", "blank"] });
db.inventory.find({ tags: ["blank", "red"] });
// 순서 확인 위해서,red, blank ,  부분 삭제하고, 다시 조회.
db.inventory.deleteOne({ item: "notebook" });
db.inventory.find({ tags: ["red", "blank"] }); // 순서에 매칭되는 부분 체크.
// 원래대로 복구,
db.inventory.insertOne({ item: "notebook", qty: 50, tags: ["red", "blank"] });

//실습3
// insertMany([{요소1},{요소2},{요소3},{요소4},{요소5}])
// use 사용 안했을 시, 기본 test 데이터베이스에 저장이됨.
// 상관이 없다고 했는데 수정함.
db.stores.insertMany([
  // _id 생략시, ObjectID 자동 생성,
  // _id : 1 , 값을 명시, 그 값으로 생성됨. -> 주의사항, 유니크 부분이 잘 지켜지는지.여부.
  { _id: 1, name: "Java Hut", description: "Coffee and cakes" },
  { _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
  { _id: 3, name: "Coffee Shop", description: "Just coffee" },
  { _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" },
  { _id: 5, name: "Java Shopping", description: "Indonesian goods" },
]);
db.stores.find();
//Text index -> 4장 인덱스
// 인덱스 부분, 검색시 속도를 향상 시키기 위한 기법,
// 보통, 기본 PK 에대해서 인덱스 설정이 기본으로 됨.
// 주의사항,) 복합키 인덱스 설정을 할 때, 너무 많은 조건을 설정하게되면,
// 조건을 맞추는 자원 소모가 더 큼.
// 검색을 하는 자원 소모보다 , 조건을 맞추는 부분이 더 힘들어짐.
// 결과 -> 성능이 떨어짐. -> 튜닝 부분이 어려움.
// 기본 인덱스 이용하되, 만약, 복합키를 사용한다면, 2개 ~ 3개정도 사용하되.
// 꼭 확인 후 설정 적용 하길 권장.
// 디비 튜닝을 하시는 엔지니어 따로 있음.
// 우리가 , 기본으로 확인시, 복합키 쓸때, 2개 ~ 3개정도만하기.

//index , 책의 맨뒤에 있는 색인과 같은 역할.
// index 없이 검색을 하면, 풀스캔 전체 탐색,
// index 설정 하면, 해당 중간 지점에서 검색을 하기 때문에 좀더 빠름.
// b-tree 구조 (자료구조) , 검색.

// $text 연산자를 이용하기 위해서는 반드시
// 텍스트 인덱스를 설정해야 하고,
// 한 컬렉션 하나의 텍스트 인덱스만 설정가능하고,
// 여러 키를 할 때는 , 복합키 형식으로 설정.
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

// 잘못됨. tags의 첫번째 인자[0]가 아니라
//tags 배열의 0이란 원소를 출력하라는 의미
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
// tags.$ 의미 , 앞에 검색한 결과의 영향을 받아서 출력이됨.
db.inventory.find({ tags: "red" }, { "tags.$": true });

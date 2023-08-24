use("testDB");

// 몽고 디비 js 기반이라서, 문법 스타일 js 형식,
// 컬렉션 이름, { 속성 : 값, 속성2 : 값 }
db.createCollection("cappedC", { capped: true, size: 10000 });
use("testDB");
db.cappedC.insertOne({ x: 1 });
//전체 조회.
db.cappedC.find();
//상태 조회
use("testDB");
db.cappedC.stats();

//반복문 여러 데이터 입력해서 전체 용량을 초과 시키고.
//오래된 데이터가 삭제되는 부붑 확인하고 넘어가기
use("testDB");

for (i = 0; i < 1000; i++) {
  db.cappedC.insertOne({ x: i });
}

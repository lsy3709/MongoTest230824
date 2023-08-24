use("testDB");

// 몽고 디비 js 기반이라서, 문법 스타일 js 형식,
// 컬렉션 이름, { 속성 : 값, 속성2 : 값 }
db.createCollection("cappedC", { capped: true, size: 10000 });
use("testDB");
db.cappedC.insertOne({ x: 1 });
//전체 조회.
db.cappedC.find();

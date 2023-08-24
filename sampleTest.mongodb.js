// Select the database to use.
use("blog");

db.users.find();
db.users.insertOne({
  name: { first: "sang", last: "Lee" },
  email: "lsy2@naver.com",
  Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
});

use("blog");
db.users.updateOne({ name: "sangyong" }, { $set: { passwrod: "1234" } });

use("blog");
db.users.updateOne(
  { email: "lsy2@naver.com" },
  { $set: { "name.last": "LEE변경함" } }
);

use("blog");
db.users.findOne({ "name.first": "sang" });

use("blog");
// 잠깐 보류, 관련 설정 제가 검색해서, 알려드림.
// 설정 변경하면 됨.
db.users.findOne({ _id: ObjectId("64e6bb9cf411f4de568fda64") });
// 설정.
// 버전 5 확인 했는데, 지금 4.4.24 확인 다시 이야기할게요.
// let ObjectID = require('mongodb').ObjectID
// 실제 작업 할 때는 가급적이면, 최신 버전으로 사용을 합니다.
// 단점, 샤딩, 복제가 다 따로 설정을 다해야하고,
//
// 원격지 atlasdb : 외부에 몽고디비를 설치하는 부분.
// 기본 버전 5, 샤딩, 복제 지원 해줄거임.
// 프리티어 무료 버전.
// 단점, 무료이다 보니, 파일 분산 처리가 속도가 늦어요.
// 그래서, 자기 가상 머신 , 수동으로 설치해서 보통 사용.
// 4 버전까지 복제, 샤딩이 지원, 5버전 이후로 따로 설정을 해야함.
// 5 버전 이후로 설치시 실행 명령어 들이 몇개 안보임.

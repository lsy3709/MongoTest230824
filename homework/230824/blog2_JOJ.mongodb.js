//데이터 : 5개 정도 샘플 넣기.
use("blog2");
db.users.insertMany([
  {
    name: { first: "jo", last: "GyoungJae" },
    email: "asdfasd@naver.com",
    password: "1234",
    Tags: ["오늘은", "피곤하다", "자고싶다"],
    insertdate: new Date(),
  },

  {
    name: { first: "kim", last: "MinSung" },
    email: "aasddsd@gmail.com",
    password: "12344",
    Tags: ["오늘은2", "피곤하다2", "자고싶다2"],
    insertdate: new Date(),
  },

  {
    name: { first: "hong", last: "GilDong" },
    email: "hong@naver.com",
    password: "123423",
    Tags: ["오늘은3", "피곤하다3", "자고싶다3"],
    insertdate: new Date(),
  },

  {
    name: { first: "chi", last: "Sung" },
    email: "asdqwewe@daum.com",
    password: "1234asdf",
    Tags: ["오늘은dx", "피곤하다dc", "자고싶다asd"],
    insertdate: new Date(),
  },

  {
    name: { first: "dull", last: "Lee" },
    email: "Lee@naver.com",
    password: "1234sdf",
    Tags: ["오늘은76", "피곤하다67", "자고싶다67"],
    insertdate: new Date(),
  },
]);
// _id 제외, password 제외 해서 보기.
use("blog2");
db.users.find({}, { _id: false, password: false });

use("blog2");
db.users.find({}, { _id: false, email: true, password: true });

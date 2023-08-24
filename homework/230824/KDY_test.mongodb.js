use("blog2");

db.users.find();
db.users.insertOne({
  name: { first: "doyeon", last: "Kim" },
  email: "kdy@naver.com",
  password: "1234",
  date: new Date(),
  Tags: ["2023년 08월 24일", "날씨 : 비", "오늘 점심 맘스터치", "맛있당~"],
});

use("blog2");
db.users.insertOne({
  name: { first: "dodo", last: "Kim" },
  email: "dodo@naver.com",
  password: "12345",
  date: new Date(),
  Tags: ["2023년 08월 24일", "날씨 : 맑음", "놀러가야지", "계곡 짱~"],
});

use("blog2");
db.users.insertOne({
  name: { first: "bao", last: "Phu" },
  email: "bao@naver.com",
  password: "0720",
  date: "2023년 07월 20일",
  Tags: ["2023년 07월 20일", "푸바오공주", "태어난 날", "빵떡"],
});

use("blog2");
db.users.find({}, { _id: false, password: false });

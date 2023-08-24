use("blog2");

// 1970-01-01T00:00:00.000+00:00
db.users.insertOne({
  name: { first: "jieun", last: "baek" },
  email: "uzzz7899@gmail.com",
  password: "0525",
  Tags: ["8월 24일", "오늘 날씨", "천둥 동반 많은 비"],
  date: new Date("YYYY-mm-ddTHH:MM:ss"),
});
// 등록시 현재 시간
// 2023-08-24T06:57:13.872+00:00
db.users.insertOne({
  name: { first: "jieun", last: "baek" },
  email: "uzzz7899@gmail.com",
  password: "0525",
  Tags: ["8월 24일", "오늘 날씨", "천둥 동반 많은 비"],
  date: new Date(""),
});

// 2023-08-24T06:58:19.631+00:00
db.users.insertOne({
  name: { first: "doy", last: "kim" },
  email: "kdy@gmail.com",
  password: "0819",
  Tags: ["조금 느리다", "화난다", "참아주자"],
  date: ISODate(),
});

//
db.users.insertOne({
  name: { first: "fubao", last: "ever" },
  email: "hibao@gmail.com",
  password: "0721",
  Tags: ["정말 귀여움", "뚠빵", "공주"],
  date: new Date("YYYY-mm-dd"),
});

db.users.insertOne({
  name: { first: "guma", last: "ho" },
  email: "pumstpot@gmail.com",
  password: "0202",
  Tags: ["호박고구마", "마트", "달달"],
  date: new Date(),
});

// _id, 비밀번호 프로젝션
use("blog2");
db.users.find(
  {},
  {
    _id: false,
    password: false,
  }
);

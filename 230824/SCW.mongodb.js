use("blog2");
db.users.insertOne({
  name: { first: "Song", last: "chiwon" },
  email: "scw387@naver.com",
  password: "123456",
  Tags: ["학생", "부산IT센터", "조별과제", "취직준비중"],
  date: new Date(),
});

use("blog2");

db.users.updateOne(
  { email: "songchi9980@gamil.com" },
  { $set: { email: "scw387@naver.com" } }
);

use("blog2");
db.users.find(
  {},
  {
    _id: false,
    password: false,
  }
);

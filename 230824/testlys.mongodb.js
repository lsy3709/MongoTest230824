//생성
use("blog2");
db.createCollection("users", { capped: true, size: 10000 });

//데이터5개추가
for (i = 0; i < 5; i++) {
  use("blog2");
  db.users.insertOne({
    name: { first: "Yeongseok[" + i + "]", last: "Lee[" + i + "]" },
    email: "lys@naver.com[" + i + "]",
    password: "123456",
    Tags: [
      "부산광역시[" + i + "]",
      "부산진구[" + i + "]",
      "서면[" + i + "]",
      "IT교육센터[" + i + "]",
    ],
    Date: new Date(),
  });
}

//_id, password 제외해서 보기
use("blog2");
db.users.find(
  {},
  {
    _id: false,
    password: false,
  }
);

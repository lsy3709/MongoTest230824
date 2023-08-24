use("blog2");
db.users.insertMany([
  {
    name: { first: "John", last: "Doe" },
    email: "john@example.com",
    password: "password_1",
    Tags: ["tag1", "tag2"],
    등록일: new Date(),
  },
  {
    name: { first: "Jane", last: "Smith" },
    email: "jane@example.com",
    password: "password_2",
    Tags: ["tag3", "tag4"],
    등록일: new Date(),
  },
  {
    name: { first: "kiara", last: "Blackburn" },
    email: "kiara@example.com",
    password: "password_3",
    Tags: ["tag5", "tag6"],
    등록일: new Date(),
  },
  {
    name: { first: "Will", last: "Smith" },
    email: "will@example.com",
    password: "password_4",
    Tags: ["tag7", "tag8"],
    등록일: new Date(),
  },
  {
    name: { first: "Donald", last: "Trump" },
    email: "donald@example.com",
    password: "password_5",
    Tags: ["tag9", "tag10"],
    등록일: new Date(),
  },
]);

db.users.find({}, { _id: 0, password: 0 });

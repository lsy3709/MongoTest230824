use('blog2')
db.createCollection('users')
colletion = db.users

db.users.insertMany([{
    email: { first: "sang5", last: "Lee5" },
    password: "lsy5@naver.com",
    Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
    등록일: new Date()
},
{
    email: { first: "sang1", last: "Lee1" },
    password: "lsy1@naver.com",
    Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
    등록일: new Date()
},
{
    email: { first: "sang2", last: "Lee2" },
    password: "lsy2@naver.com",
    Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
    등록일: new Date()
},
{
    email: { first: "sang3", last: "Lee3" },
    password: "lsy3@naver.com",
    Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
    등록일: new Date()
},
{
    email: { first: "sang4", last: "Lee4" },
    password: "lsy4@naver.com",
    Tags: ["몽고디비수업", "점심메뉴 ?", " 면? 밥?", "비와서 많이 안 왔나?"],
    등록일: new Date()
},
]);


// 검색
db.users.find(
    {},
    {
        _id: false,
        // "_id":false 의미, 이거 빼고 다 보여주세요.

        // name, email 2개만 보이고 , 전부 다 가려주세요.
        name: true,
        email: true,

        //추가. 패스워드 빼고 전부 다보여주세요.

        password: false,
    }
);
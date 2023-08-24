use("blog2");

db.user.insertOne({
    name : {first : "dong", last:"hong"},
    email : "hgd@aaa.com",
    password : "123456",
    tags: ["MySql", "파이썬", "비가 와서 많이 안 왔다."],
    regdate : new Date("<YYYY-mm-dd>")
});

db.user.insertOne({
    name : {first : "dong", last:"lee"},
    email : "hgd01@aaa.com",
    password : "123456",
    tags: ["MySql01", "파이썬01", "비가 와서 많이 안 왔다.01"],
    regdate : new Date("<YYYY-mm-dd>")
});


db.user.insertOne({
    name : {first : "dong", last:"kim"},
    email : "hgd02@aaa.com",
    password : "123456",
    tags: ["MySql02", "파이썬02", "비가 와서 많이 안 왔다.02"],
    regdate : new Date("<YYYY-mm-dd>")
});

db.user.insertOne({
    name : {first : "dong", last:"park"},
    email : "hgd03@aaa.com",
    password : "123456",
    tags: ["MySql03", "파이썬03", "비가 와서 많이 안 왔다.03"],
    regdate : new Date("<YYYY-mm-dd>")
});


db.user.insertOne({
    name : {first : "dong", last:"chol"},
    email : "hgd04@aaa.com",
    password : "123456",
    tags: ["MySql04", "파이썬04", "비가 와서 많이 안 왔다.04"],
    regdate : new Date("<YYYY-mm-dd>")
});


db.user.find(
    {},
    {
       "_id":false,
       "password":false
    }
);

db





use("testDB");

// 몽고 디비 js 기반이라서, 문법 스타일 js 형식,
// 컬렉션 이름, { 속성 : 값, 속성2 : 값 }
db.createCollection("cappedC", { capped: true, size: 10000 });
use("testDB");
db.cappedC.insertOne({ x: 1 });

//전체 조회.
use("testDB");
db.cappedC.find();
// 상태 조회
use("testDB");
db.cappedC.stats();

// 반복문, 여러 데이터 입력해서, 전체 용량을 초과 시키고,
// 오래된 데이터 가 삭제 되는 부분 확인하고, 넘어가기.
use("testDB");
// for (i = 1010; i < 1020; i++) {
for (i = 0; i < 10000000; i++) {
  db.cappedC.insertOne({ x: i });
}

//조회는 콤파스에서 확인 해보기.
//x:1 있는지 여부만 확인.

// 첫 반복문 실행 후, 첫 시작 값이 667정도 값으로 시작하는 부분 확인 하면됩니다.
// 입력의 값의 범위 : 0 ~ 999
// 반복문 후, 조회 된값 을 확인. 시작 66x ~ 999
// 1 ~ 6xx , 이부분 삭제 되었다.
use("testDB");
db.cappedC.findOne({ x: 10 });

use("testDB");
db.cappedC.find({
  x: { $lte: 400 },
});

// 프로젝션 확인. -> 보고 싶은 열을 선택 하는 옵션,
// db.users.find( { <쿼리(=where)>  } ,  { <프로젝션(=보고싶은 컬럼)>   }  )
use("blog");
db.users.find(
  {},
  {
    // _id , false 아닐 경우를 제외하고 항상 표기.
    // "_id":false 의미, 이거 빼고 다 보여주세요.
    // _id: false,
    // _id 항상표기

    // name, email 2개만 보이고 , 전부 다 가려주세요.
    name: true,
    email: true,

    //추가. 패스워드 빼고 전부 다보여주세요.
    //  name, email , age, password
    // 모순. 주의.-> false 일 때 모순.
    password: true,
  }
);

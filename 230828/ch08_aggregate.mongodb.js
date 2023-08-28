// 샘플 데이터 베이스 특정 디비 선택 안하면
// 기본으로 -> use("test")
// 샘플 디비, 공공데이터 각 지역별 지출 보고, 가져오기.
//
//구조db.rating.aggregate([ {각스테이즈1},{각스테이즈2},{각스테이즈3},...])
db.rating.aggregate([
  {
    //각스테이즈1
    $match: {
      user_id: { $lte: 6 },
    },
  },
  // 각 스테이지 별로 연산된
  // 결과 데이터가 ,
  // 또 다른 스테이즈의 입력값으로
  // 사용이됨.
  // 파이프라인.
  {
    //각스테이즈2, 중요함.
    $group: {
      _id: "$rating",
      count: {
        $sum: 1,
      },
    },
  },
]);

// 기본 $project 연산자 예시.
db.rating.aggregate([
  {
    $project: { _id: 0, rating: 1 },
  },
]);

// 새로운 필드 추가 예제.
db.rating.aggregate([
  {
    $project: { _id: 0, rating: 1, hi: "new field" },
  },
]);

// 새 필드에 연산의 결과도 가능.
db.rating.aggregate([
  {
    //multiply 새 필드를 추가함.
    // $multiply 함수는 [요소1,요소2]: 요소1 x 요소2
    $project: {
      _id: 0,
      multiply: {
        $multiply: ["$_id", "$user_id"],
      },
    },
  },
]);

// 그룹 예시.
db.rating.aggregate([
  {
    $group: {
      // _id: "$rating", 기준으로
      // 그룹 나누기.
      _id: "$rating",
      count: { $sum: 10 },
    },
  },
]);

//
db.rating.aggregate([
  {
    $match: {
      rating: {
        $gte: 4,
      },
    },
  }, //스테이지 중하나인  match : 조건
  {
    $group: {
      //$rating 앞의 출력 결과의
      // 필드를 재사용한다.
      _id: "$rating",
      user_ids: {
        // rating_avg: {
        // 배열로 만들기.
        $push: "$user_id", // 배열로 만들기.
      },
    },
  },
]);

// $unwind
// 각 문서로 분해하기.
db.rating.aggregate([
  {
    $match: {
      rating: {
        $gte: 4,
      },
    },
  }, //스테이지 중하나인  match : 조건, 1번째  스테이지
  {
    $group: {
      _id: "$rating",
      user_ids: {
        $push: "$user_id", // 배열로 만들기. 2번째 스테이지.
      },
    },
  },
  {
    $unwind: "$user_ids",
  }, // 3번째 스테이지 , unwind 확인.
]);

// $unwind 옵션 ,
// includeArrayIndex
db.rating.aggregate([
  {
    $match: {
      rating: {
        $gte: 4,
      },
    },
  }, //스테이지 중하나인  match : 조건, 1번째  스테이지
  {
    $group: {
      _id: "$rating",
      user_ids: {
        $push: "$user_id", // 배열로 만들기. 2번째 스테이지.
      },
    },
  },
  {
    $unwind: {
      path: "$user_ids",
      // 옵션 부분,
      includeArrayIndex: "index",
    },
  }, // 3번째 스테이지 , unwind 확인.
]);

// $out , 새 컬렉션에 새로 쓰기.

db.rating.aggregate([
  {
    $group: {
      _id: "$rating",
      user_ids: {
        $push: "$user_id", // 배열로 만들기. 2번째 스테이지.
      },
    },
  },
  {
    $out: "user_ids_by_rating", //컬렉션 이름.
  }, // out 어느 컬렉션 저장.
]);

// 새로 생성된 새 컬렉션 조회.
db.user_ids_by_rating.find();

// 페이징 시 많이 사용되는 스테이지
db.rating.aggregate([
  {
    $sort: {
      user_id: -1,
    },
  }, // 3번째 정렬. 순서1
  {
    $limit: 5, // 순서2
  },
  {
    $skip: 1, // 순서3
  },
]);

// 실습 예제.
db.local.aggregate([
  {
    $match: { sub_category: "의회비" },
  },
  {
    $group: {
      _id: "$city_or_province",
      expense_avg: {
        $avg: "$this_term_expense",
      },
    },
  },
  {
    $sort: {
      expense_avg: -1,
    },
  },
]);

//샘플 데이터 베이스 특정 디비 선택 안하면 기본으로 -> use("test")
db.rating.insertMany([
  { _id: 1, rating: 1, user_id: 2 },
  { _id: 2, rating: 2, user_id: 3 },
  { _id: 3, rating: 3, user_id: 4 },
  { _id: 4, rating: 3, user_id: 1 },
  { _id: 5, rating: 4, user_id: 5 },
  { _id: 6, rating: 4, user_id: 8 },
  { _id: 7, rating: 5, user_id: 9 },
  { _id: 8, rating: 5, user_id: 10 },
  { _id: 9, rating: 5, user_id: 11 },
  { _id: 10, rating: 5, user_id: 12 },
]);
db.rating.aggregate([
  {
    $match: {
      user_id: { $lte: 6 },
    },
  },
  {
    $group: {
      _id: "$rating",
      count: {
        $sum: 1,
      },
    },
  },
]);

db.rating.aggregate([
  {
    $project: { _id: 0, rating: 1 },
  },
]);
db.rating.aggregate([
  {
    $project: { _id: 0, rating: 1, hi: "new field" },
  },
]);

db.rating.aggregate([
  {
    $project: {
      _id: 0,
      multiply: {
        $multiply: ["$_id", "$user_id"],
      },
    },
  },
]);

//샘플 코드
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

db.local.aggregate([
  // 조건1: 2차 지방자치단체
  {
    $match: {
      sub_category: "의회비", // 조건3: 의회비
    },
  },
  {
    $group: {
      _id: "$city_or_province",
      max_expense_last_year: {
        $max: "$former_expense", // 조건2: 작년 시도별
      },
    },
  },
  {
    $sort: {
      max_expense_this_year: -1, // 조건4: 내림차순 정렬
    },
  },
]);

//각스테이지 별로 연쇤괸 결과데이터가 또 다른 스테이즈의 입력ㄱ밧으로 사용이 됨 = 파이프 라인

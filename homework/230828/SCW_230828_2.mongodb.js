db.city_or_province.aggregate([
  {
    $match: { sub_category: "급여" },
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
      expense_avg: 0,
    },
  },
]);

db.city_or_province.aggregate([
  {
    $match: { sub_category: "급여" },
  },
  {
    $group: {
      _id: "$city_or_province",
      expense_min: {
        $min: "$this_term_expense",
      },
    },
  },
  {
    $sort: {
      expense_min: 1,
    },
  },
]);

db.city_or_province.aggregate([
  {
    $match: { sub_category: "급여" },
  },
  {
    $group: {
      _id: "$city_or_province",
      expense_max: {
        $max: "$this_term_expense",
      },
    },
  },
  {
    $sort: {
      expense_max: -1,
    },
  },
]);

db.city_or_province.aggregate([
  {
    $sort: { this_term_expense: 1, former_expense: 1 },
    //만들어진 이 스테이지의 결과로 밑에 그룹에서 사용한다
  },
  {
    // 2번째 스테이지, 그룹 나누기,

    $group: {
      _id: "$city_or_province",
      // main_category 임시필드의 값으로 첫번째 요소가지고옴
      main_category: { $first: "$main_category" },
      // sub_category 임시필드의 값으로 첫번째 요소가지고옴
      sub_category: { $first: "$sub_category" },
      // this_term_expense 임시필드의 값으로 첫번째 요소가지고옴
      this_term_expense: { $first: "$this_term_expense" },
      former_expense: { $first: "$former_expense" },
    },
  },
  {
    //3개의 크기의 샘플로 랜덤하게 출력.
    $sample: {
      size: 3,
    },
  },
]);

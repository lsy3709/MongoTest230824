//샘플코드
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
  // 조건1: 2차 지방자치단체(local)
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

//1번 문제
db.city_or_province.aggregate([
  {
    $facet: {
      by_city_or_province: [
        {
          $group: {
            _id: "$city_or_province",
            sum_expenses: { $sum: "$this_term_expense" },
          },
        },
      ],
      by_sub_category: [
        {
          $group: {
            _id: "$sub_category",
            main_category: { $first: "$main_category" },
            sum_expenses: { $sum: "$this_term_expense" },
          },
        },
      ],
    },
  },
]);

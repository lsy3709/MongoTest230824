// 실습하기.
// 2차 지방자치단체 올해 시도별 의회비 평균을 구해보기.
// 만약, 구해진 의회비를 내림차순으로 정렬 가능하면 하기.
// !
// 이 샘플 코드를 참고해서,
// 조건1 2차 지방자치단체(local)
// 조건2 작년 시도별(city_or_province)
// 조건3 의회비 최대을 구해보기.
// 조건4 내림차순.
db.local.aggregate([
  {
    $match: { sub_category: "의회비" },
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
      expense_avg: -1,
    },
  },
]);

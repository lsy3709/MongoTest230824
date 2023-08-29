// 1 문제,          평균, 최대, 최소로 변경해서 실행 해보기.
// 2 문제, 올해 -> 작년 변경, 지출이 가장 작은 지역명 기준
// 샘플을 3개정도 뽑아보기.
// 3 문제, 구조 및 각 스테이지 이해하기.

//1.하
db.city_or_province.aggregate([
  //데이터파이프라인 {},{},{} 순으로 엮여서 동작하게끔
  {
    $facet: {
      //배열형태로 출력되게끔 함. 그 안의 필드가 by_city_or_province, by_sub_category 인것
      by_city_or_province: [
        {
          $group: {
            _id: "$city_or_province", //by_city_or_province의 값은 서울, 부산 등의 시 이름으로 그룹화

            sum_expenses: { $sum: "$this_term_expense" }, //각 시의 올해 사용한 돈 총합
            avg_expenses: { $avg: "$this_term_expense" }, //각 시의 올해 사용한 돈 평균
            max_expenses: { $max: "$this_term_expense" }, //각 시의 올해 사용한 돈 최대
            min_expenses: { $min: "$this_term_expense" }, //각 시의 올해 사용한 돈 최소
          },
        },
      ],

      by_sub_category: [
        {
          $group: {
            _id: "$sub_category", //by_sub_category의 값은 복리후생비, 급여같은   지출 세부내역을 기준으로 그룹화

            main_category: { $first: "$main_category" }, //그 세부내역의 상위개념(급여와 인건비가 있다면 급여의 상위개념인 인건비) 출력. 그중 가장 첫번째값

            sum_expenses: { $sum: "$this_term_expense" }, //각 시의 올해 사용한 돈 총합
            avg_expenses: { $avg: "$this_term_expense" }, //각 시의 올해 사용한 돈 평균
            max_expenses: { $max: "$this_term_expense" }, //각 시의 올해 사용한 돈 최대
            min_expenses: { $min: "$this_term_expense" }, //각 시의 올해 사용한 돈 최소
          },
        },
      ],
    },
  },
]);

//2.중
db.city_or_province.aggregate([
  {
    $sort: { this_term_expense: 1 }, //올해 사용한 돈에따라 오름차순으로 나열(=가장 작은 값이 최상단으로)
  },
  {
    $group: {
      _id: "$city_or_province", //시 이름으로 그룹화

      main_category: { $first: "$main_category" }, //그 시의 지출내역 첫번째 내용

      sub_category: { $first: "$sub_category" }, //그 시의 세부지출내역 첫번째 내용

      this_term_expense: { $first: "$former_expense" }, //그 시의 작년 첫번째 세부지출내역의 값
    },
  },
  {
    $sample: {
      size: 3, //랜덤으로 샘플3개 출력
    },
  },
]);

//3.최상(그대로제출) 나중에학습
db.local.aggregate([
  {
    $group: {
      _id: "$local_government",
      expense: { $sum: "$this_term_expense" },
    },
  },
  {
    $lookup: {
      from: "population",
      localField: "_id",
      foreignField: "local_government",
      as: "population_data",
    },
  },
  {
    $match: { population_data: { $size: 1 } },
  },
  {
    $unwind: "$population_data",
  },
  {
    $addFields: {
      "population_data.expense": "$expense",
    },
  },
  {
    $replaceRoot: {
      newRoot: "$population_data",
    },
  },
]);

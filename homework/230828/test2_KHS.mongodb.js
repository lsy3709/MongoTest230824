//1번 문제
db.city_or_province.aggregate([
  {
    $facet: {
      //조건1과 조건2 하나로 묶기
      by_city_or_province: [
        //조건1
        {
          $group: {
            // 그룹화
            _id: "$city_or_province", //자치단체별
            sum_expenses: { $sum: "$this_term_expense" }, //총 사용한 운영비
            max_expenses: { $max: "$this_term_expense" }, //운영비 최댓값
            min_expenses: { $min: "$this_term_expense" }, //운영비 최소값
            avg_expenses: { $avg: "$this_term_expense" }, //운영비 평균값
          },
        },
      ],
      by_sub_category: [
        //조건2
        {
          $group: {
            // 그룹화
            _id: "$sub_category", //세부항목별
            main_category: { $first: "$main_category" },
            sum_expenses: { $sum: "$this_term_expense" }, // 총 사용비
            max_expenses: { $max: "$this_term_expense" }, //운영비 최댓값
            min_expenses: { $min: "$this_term_expense" }, //운영비 최소값
            avg_expenses: { $avg: "$this_term_expense" }, //운영비 평균값
          },
        },
      ],
    },
  },
]);

//1-1 문제

db.local.aggregate([
  {
    $facet: {
      //조건1과 조건2 하나로 묶기
      by_city_or_province: [
        //조건1
        {
          $group: {
            // 그룹화
            _id: "$city_or_province", //자치단체별
            max_increase_decrease_rate: { $max: "$increase_decrease_rate" }, //운영비 인상율 최댓값
            min_increase_decrease_rate: { $min: "$increase_decrease_rate" }, //운영비 인상율 최소값
            avg_increase_decrease_rate: { $avg: "$increase_decrease_rate" }, //운영비 인상율 평균값
          },
        },
      ],
      by_sub_category: [
        //조건2
        {
          $group: {
            // 그룹화
            _id: "$sub_category", //세부항목별
            main_category: { $first: "$main_category" },
            max_increase_decrease_rate: { $max: "$increase_decrease_rate" }, //운영비 인상율 최댓값
            min_increase_decrease_rate: { $min: "$increase_decrease_rate" }, //운영비 인상율 최소값
            avg_increase_decrease_rate: { $avg: "$increase_decrease_rate" }, //운영비 인상율 평균값
          },
        },
      ],
    },
  },
]);

//2번 문제
db.city_or_province.aggregate([
  {
    $sort: { this_term_expense: -1 }, // 올해 운영비 내림차순 정렬
  },
  {
    $group: {
      // 필드로 그룹화 한 뒤 각 그룹의 첫 번째 문서 정보를 남김
      _id: "$city_or_province",
      main_category: { $first: "$main_category" },
      sub_category: { $first: "$sub_category" },
      this_term_expense: { $first: "$this_term_expense" },
    },
  },
  {
    $sample: {
      size: 2, // 2개의 지역을 랜덤하게 뽑음
    },
  },
]);

//2-1번 문제

db.population.aggregate([
  {
    $sort: { population: -1 }, // 인구수 내림차순 정렬
  },
  {
    $group: {
      // 필드로 그룹화 한 뒤 각 그룹의 첫 번째 문서 정보를 남김
      _id: "$city_or_province",
      local_government: { $first: "$local_government" },
      population: { $first: "$population" },
    },
  },
  {
    $sample: {
      size: 3, // 3개의 지역을 랜덤하게 뽑음
    },
  },
]);

//3번 문제
db.local.aggregate([
  {
    $group: {
      _id: "$local_government", // 2차 자치단체명으로 그룹화
      expense: { $sum: "$this_term_expense" }, // 예산 총합 계산
    },
  },
  {
    $lookup: {
      from: "population",
      localField: "_id", // 2차 자치단체명을 사용하여 조인
      foreignField: "local_government",
      as: "population_data",
    },
  },
  {
    $match: { population_data: { $size: 1 } }, // 중복된 지역 제외
  },
  {
    $unwind: "$population_data", // 배열 언윈드
  },
  {
    $addFields: {
      "population_data.expense": "$expense", // 예산 정보 추가
    },
  },
  {
    $replaceRoot: {
      newRoot: "$population_data", // 임베디드 도큐먼트를 도큐먼트로 교체
    },
  },
]);

//3-1번 문제
db.by_type.aggregate([
  {
    $group: {
      _id: "$county", // 지역으로 그룹화
      accident_count: { $sum: "$accident_count" }, // 사고 수 총합
    },
  },
  {
    $lookup: {
      from: "area",
      localField: "_id", // 2차 자치단체명을 사용하여 조인
      foreignField: "county",
      as: "population_data",
    },
  },
  {
    $match: { population_data: { $size: 1 } }, // 중복된 지역 제외
  },
  {
    $unwind: "$population_data", // 배열 언윈드
  },
  {
    $addFields: {
      "population_data.accident_count": "$accident_count", // 사고 수 추가
    },
  },
  {
    $replaceRoot: {
      newRoot: "$population_data", // 임베디드 도큐먼트를 도큐먼트로 교체
    },
  },
]);

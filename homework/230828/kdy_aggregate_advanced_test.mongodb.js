// 1. 하
// 1차 자치단체(city_or_province) 컬렉션에서
// facet 스테이지를 이용하여
// 조건1
// 자치단체별(city_or_province)로
// 총 사용한 운영비를 구하고,
// 조건2
// 세부항목별(sub_category)로
// 총 사용한 운영비를 구해서
// 하나의 도큐먼트로 표시하기.
// -> facet 스테이지 내부에서
// group 스테이지를 이용하여
// city_or_province와 sub_category로
// 묶기.
// ->

// 1 문제, 평균, 최대, 최소로 변경해서 실행 해보기.

// 평균
db.city_or_province.aggregate([
  {
    $facet: {
      by_city_or_province: [
        {
          $group: {
            _id: "$city_or_province",
            avg_expenses: { $avg: "$this_term_expense" },
          },
        },
      ],
      by_sub_category: [
        {
          $group: {
            _id: "$avg_expenses",
            main_category: { $first: "$main_category" },
            avg_expenses: { $avg: "$this_term_expense" },
          },
        },
      ],
    },
  },
]);

// 최대
db.city_or_province.aggregate([
  {
    $facet: {
      by_city_or_province: [
        {
          $group: {
            _id: "$city_or_province",
            max_expenses: { $max: "$this_term_expense" },
          },
        },
      ],
      by_sub_category: [
        {
          $group: {
            _id: "$max_expenses",
            main_category: { $first: "$main_category" },
            max_expenses: { $max: "$this_term_expense" },
          },
        },
      ],
    },
  },
]);

// 최소
db.city_or_province.aggregate([
  {
    $facet: {
      by_city_or_province: [
        {
          $group: {
            _id: "$city_or_province",
            min_expenses: { $min: "$this_term_expense" },
          },
        },
      ],
      by_sub_category: [
        {
          $group: {
            _id: "$min_expenses",
            main_category: { $first: "$main_category" },
            min_expenses: { $min: "$this_term_expense" },
          },
        },
      ],
    },
  },
]);

// 2. 중
// 1차 자치단체를 랜덤하게 두 곳을 골라 올해
// 가장 많이 사용한 운영비 세부항목을 표시하기.
// ->
// 1) city_or_province 컬렉션의 도큐먼트를
// 올해 운영비 내림차순으로 정렬.
// 2) 지역명으로 그룹화 하면서 첫 번째 도큐먼트 정보 남김.
// 3) 2개의 도큐먼트를 랜덤하게 뽑기.
// ->

// 2 문제, 올해 -> 작년 변경, 지출이 가장 작은 지역명 기준
// 샘플을 3개정도 뽑아보기.

db.city_or_province.aggregate([
  {
    // 작년
    $sort: { former_expense: -1 },
  },
  {
    $group: {
      // 지역명으로 그룹화하면서 첫번째 도큐먼트 정보
      _id: "$city_or_province",
      main_category: { $last: "$main_category" },
      sub_category: { $last: "$sub_category" },
      former_expense: { $last: "$former_expense" },
    },
  },
  {
    // 3개 샘플뽑기
    $sample: {
      size: 3,
    },
  },
]);

// 3. 최상
// -전국 2차 자치단체의 이름, 총 예산, 주민등록
// 인구를 하나의 도큐먼트로 정리해서 출력하기.
// - 2차 자치단체 이름이ㅣ 두번 이상 쓰인 곳은
// 제외하고 출력해야함.
// - 임베디드 구조가 없는 형식으로 출력해야 함.

// -> unwind 와 addFields로 인구 정보와 예산정보를 합치는 방법

// 1) local 컬렉션을 2차 자치단체명으로 그룹화
// 2) population 컬렉션 과 2차 자치단체명으로 조인한다.
// 3) 2차 자치단체명이 중복되는 지역을 제외한다.
// 4) 조인된 배열 속 임베디드 도큐먼트에 예산 정보를 추가한다.
// 5) replaceRoot 스테이지로 임베디드 도큐먼트를 도큐먼트 자체로
// 변경하기.

// ->
db.local.aggregate([
  {
    //스테이지1 2차 자치단체명으로 그룹화
    $group: {
      _id: "$local_government",
      expense: { $sum: "$this_term_expense" },
    },
  },
  {
    //스테이지2
    $lookup: {
      // population 컬렉션과 local_government 자치단체명으로 조인
      from: "population",
      localField: "_id",
      foreignField: "local_government",
      as: "population_data",
    },
  },
  {
    //스테이지3  조건이 일치한 도큐먼트만 다음 스테이지로 이동
    $match: { population_data: { $size: 1 } },
  },
  {
    //스테이지4 입력 도큐먼트가 배열로 구성된 필드를 가지고 있으며
    // 이를 여러 도큐먼트로 풀어서 다음 스테이지로 전달
    $unwind: "$population_data",
  },
  {
    //스테이지5 예산정보 필드를 추가
    $addFields: {
      "population_data.expense": "$expense",
    },
  },
  {
    //스테이지6 replaceRoot 스테이지로 임베디드 구조가 없다는 조건으로
    // 도큐먼트를 도큐먼트 자체로 변경
    $replaceRoot: {
      newRoot: "$population_data",
    },
  },
]);

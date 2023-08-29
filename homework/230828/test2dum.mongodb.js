// 1)
// 평균 출력
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
            _id: "$sub_category",
            main_category: { $first: "$main_category" },
            avg_expenses: { $avg: "$this_term_expense" },
          },
        },
      ],
    },
  },
]);

// 2)
// 작년 기준 지출이 가장 작은 지역명
db.city_or_province.aggregate([
  {
    $sort: { former_expense: 1 },
  },
  {
    $group: {
      _id: "$city_or_province",
      main_category: { $first: "$main_category" },
      sub_category: { $first: "$sub_category" },
      this_term_expense: { $first: "$this_term_expense" },
    },
  },
  {
    $sample: {
      size: 3,
    },
  },
]);

// 3)
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

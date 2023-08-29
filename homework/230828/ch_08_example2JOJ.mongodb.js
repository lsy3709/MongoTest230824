// db.population.aggregate([
//   {
//     $sort: { population: -1 },
//   },
//   {
//     $facet: {
//       city_total_population: [
//         {
//           $group: {
//             _id: "$city_or_province",
//             total_population: { $sum: "$population" },
//             count: { $sum: 1 },
//             avg_population: { $avg: "$population" },
//           },
//         },
//       ],
//       city_local_goverment: [
//         {
//           $group: {
//             _id: "$local_government",
//             total_population: { $sum: "$population" },
//           },
//         },
//       ],
//     },
//   },
// ]);

// db.city_or_province.aggregate([
//   {
//     $sort: { this_term_expense: 1 },
//   },
//   {
//     $group: {
//       _id: "$city_or_province",
//       main_category: { $first: "$main_category" },
//       sub_category: { $first: "$sub_category" },
//       this_term_expense: { $avg: "$this_term_expense" },
//     },
//   },
//   {
//     $sample: {
//       size: 2,
//     },
//   },
// ]);

db.local.aggregate([
  {
    $group: {
      _id: "$local_government",
      expense: { $max: "$this_term_expense" },
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

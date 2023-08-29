db.local.aggregate([
  {
    $match: { sub_category: "의회비" },
  },
  {
    $group: {
      _id: "$city_or_province",
      expense: { $avg: "$this_term_expense" },
    },
  },
  {
    $sort: {
      expense: -1,
    },
  },
]);

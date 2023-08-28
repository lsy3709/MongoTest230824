// 조건1 2차 지방자치단체(local)
// 조건2 작년 시도별(city_or_province)
// 조건3 의회비 최대을 구해보기.
// 조건4 내림차순.
db.local.aggregate([
    {
        $match:
            { sub_category: "의회비" }
    },
    {
        $group: {
            _id: "$city_or_province",
            expense_avg: {
                $max: "$this_term_expense"
            }
        }

    },
    {
        $sort: {
            expense_avg: -1
        }
    },
])
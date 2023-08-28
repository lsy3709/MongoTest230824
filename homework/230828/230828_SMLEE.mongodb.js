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
                $max: "$former_expense"
            }
        }

    },
    {
        $sort: {
            expense_avg: -1
        }
    },
])

// 서울시의 자치구별 인구수를 내림차순으로 검색하기
db.population.aggregate([
    {
        $match:
            { city_or_province: "서울" }
    },
    {
        $group: {
            _id: "$local_government",
            인구수: { $avg: "$population" }
        }
    },
    {
        $sort: {
            인구수: -1
        }
    },
])

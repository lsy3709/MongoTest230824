//예제 1
// city_or_province의 main_category의 expenses합계
db.city_or_province.aggregate([
    {
        $facet: {
            by_city_or_province: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$sub_category" },
                        sum_expenses: { $sum: "$this_term_expense" }
                    }
                }
            ],
            by_sub_category: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$main_category" },
                        sum_expenses: { $sum: "$this_term_expense" },
                    }
                }
            ]
        }
    }
])
// sub_category의 max_expenses
db.city_or_province.aggregate([
    {
        $facet: {
            by_city_or_province: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$sub_category" },
                        max_expenses: { $max: "$this_term_expense" }
                    }
                }
            ],
            by_main_category: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$main_category" },
                        max_expenses: { $max: "$this_term_expense" },
                    }
                }
            ]
        }
    }
])

// sub_category의 min_expenses
db.city_or_province.aggregate([
    {
        $facet: {
            by_city_or_province: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$sub_category" },
                        min_expenses: { $min: "$this_term_expense" }
                    }
                }
            ],
            by_main_category: [
                {
                    $group: {
                        _id: "$city_or_province",
                        main_category: { $first: "$main_category" },
                        min_expenses: { $min: "$this_term_expense" },
                    }
                }
            ]
        }
    }
])


//예제2 local db의 자치구별 지출항목별 비용 샘플 10개
db.local.aggregate([
    {
        $sort: { this_term_expense: -1 }
    },
    {
        $group: {
            _id: "$서울",
            main_category: { $first: "$main_category" },
            sub_category: { $first: "$sub_category" },
            local_government: { $first: "$local_government" },
            this_term_expense: { $first: "$this_term_expense" }
        }
    },
    {
        $sample: {
            size: 10
        }
    }
])


//실습 예제 상
// aggregate 파이프라인은 'local' 컬렉션과 'population' 컬렉션을 조인하고, 각 지방정부별 총 비용을 계산한 후, 
// 길이가 1인 'population_data' 배열을 필터링하고 해당 문서를 개별적으로 처리하여
//  'expense' 필드를 추가하고, 최종 결과 문서의 구조를 'population_data'로 변경
db.local.aggregate([
    {
        //  'local_government' 값을 기준으로 문서를 그룹화하고,
        //  각 그룹 내에서 'this_term_expense' 필드 값을 합산하여 해당 지방정부별 총 비용을 계산
        $group: {
            _id: "$local_government",
            expense: { $sum: "$this_term_expense" }
        }
    },
    {
        //  'population' 컬렉션과 'local' 컬렉션을 조인합니다. $lookup 연산자를 사용하여
        //  'local' 컬렉션의 '_id' 필드와 'population' 컬렉션의 'local_government' 필드를 연결
        $lookup: {
            from: "population",
            localField: "_id",
            foreignField: "local_government",
            as: "population_data"
        }
    }
    ,
    {
        //  'population_data' 필드가 배열이며 길이가 1인 문서만 필터링
        $match: { population_data: { $size: 1 } }
    },
    {
        // 'population_data' 필드를 배열에서 풀어서 개별 문서로 만듬
        $unwind: "$population_data"
    },
    {
        //  'population_data' 문서에 'expense' 필드를 추가
        //  필드에는 해당 지방정부의 총 비용이 할당
        $addFields: {
            "population_data.expense": "$expense"
        }
    }
    ,
    {
        // 결과 문서의 루트를 'population_data'로 교체
        $replaceRoot: {
            newRoot: "$population_data"
        }
    },

])

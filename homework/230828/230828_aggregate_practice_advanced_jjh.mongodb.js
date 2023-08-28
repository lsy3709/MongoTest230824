  // 1. 하
  // 1차 자치단체(city_or_province) 컬렉션에서 
  // facet -> 배열로 바꾸는 부분(하나의 값으로)
  //  스테이지를 이용하여
   
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

  db.city_or_province.aggregate([
    {
        $facet: {
          by_city_or_province : [ 
            {
                $group : {
                    _id : "$city_or_province",
                    sum_of_expense : {$sum : "$this_term_expense"}
                }
            }
           ],
        // 서브 카테고리에서 제일 많이 지출한 도시명 출력하기 //
           by_sub_category : [
            {$sort : {this_term_expense : -1}},
            {
                $group : {
                    _id : "$sub_category",
                    sum_of_expense : {$sum : "$this_term_expense"},
                    max_of_expense : {$max : "$this_term_expense"},
                    max_expense_local : {$first : "$city_or_province"},
                    min_of_expense : {$min : "$this_term_expense"},
                    avg_of_expense : {$avg : "$this_term_expense"}
                }

            }
           ],
           by_main_category : [
            {
                $group : {
                    _id : "$main_category",
                    sum_of_expense : {$sum : "$this_term_expense"},
                    max_of_expense : {$max : "$this_term_expense"},
                    min_of_expense : {$min : "$this_term_expense"},
                    avg_of_expense : {$avg : "$this_term_expense"}
                }
            }
           ]
        }
    }
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
  // city_or_province : 1차 직역 명( 시, 도)

  db.city_or_province.aggregate([{
    $sort : {this_term_expense : -1}},
    {
    $group : {
        _id : "$city_or_province",
        fst_city_or_province : {$first : "$city_or_province"},
        fst_local_government : {$first : "$local_government"},
        fst_main_category : {$first : "$main_category"},
        fst_sub_category : {$first : "$sub_category"},
        fst_this_term_expense : {$first : "$this_term_expense"},
        fst_former_expense : {$first : "$former_expense"},
        fst_increas_decrease_rate : {$first : "$increas_decrease_rate"}
    },
    },
    {
        $sample: {
            size: 2
          }
    }
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
  
  db.local.aggregate([
    {
        $group : {
            _id : "$local_government",
            sum_of_expense : {$sum : "$this_term_expense"}
        }
    },
    {
        $lookup : {
            from : "population",
            localField : "_id",
            foreignField : "local_government",
            as : "population_table"
        }
    },
    {
        $match: {
          population_table : {$size : 1}
        }
    },
    {
        $unwind : "$population_table"
    },
    {
        $addFields: {
          "population_table.expense" : "$sum_of_expense"
        }
    },
    {
        $replaceRoot: {
          newRoot: "$population_table"
        }
    }
  ])
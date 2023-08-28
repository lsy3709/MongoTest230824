//고급 스테이지 소개
// $bucket
db.rating.aggregate([
  {
    $bucket: {
      // $rating 기준으로 그룹나누기.
      groupBy: "$rating",
      //[2,3):1구간,  rating : 2
      //[3,5):2구간, rating : 3, 4
      // Others :  5부터 ~ 전체
      boundaries: [2, 3, 5],
      // 그 밖에 마치 else 사용됨.
      // 5부터 ~ 전체
      default: "Others", // 범위 밖의 기본값 필드의 이름.
      output: {
        // 표기 어떻게 할거냐?
        count: { $sum: 1 },
        //user_ids 필드의 값을 배열형식
        // 값에 배열의 값으로 user_id입력.
        user_ids: { $push: "$user_id" }, // 배열로 나타내기.
      },
    },
  },
]);

// $addFields
db.rating.aggregate([
  {
    $addFields: {
      hi: "world",
    },
  },
  { $project: { hi: 1 } },
  { $limit: 3 },
]);

// facet 의 예시
// bucketAuto 의 예시.
db.rating.aggregate([
  {
    // 배열로 만드는 연산자
    $facet: {
      // 임의 필드 이름을 정함.:categorizedByRating
      categorizedByRating: [
        // $group -> _id 값을 기준으로 그룹으로 나눈다.
        // 수동으로 나누었다면,
        {
          $group: {
            _id: "$rating",
            // $rating 별로 누적 갯수, 1씩 더한다.
            count: { $sum: 1 },
          },
        },
      ],
      //categorizedById(Auto) 의 필드 : 임시 이름.

      "categorizedById(Auto)": [
        // 자동으로 5등분.
        { $bucketAuto: { groupBy: "$_id", buckets: 5 } },
      ],
    },
  },
]);

// 예시,
// car_accident
// area 컬렉션 , _id 와
// by_month 컬렉션 비교 .
// -> 각 지역별 인구정보를 by_month 컬렉션과 함께 묶기.

// 현재 컬렉션 :by_month
db.by_month.aggregate([
  {
    $lookup: {
      // 조인할 대상: area 컬렉션
      from: "area",
      // 현재 컬렉션: 	by_month 의 필드.
      localField: "area_id",
      // 조인할 대상 : area 컬렉션 의 필드.
      foreignField: "_id",
      // 현재 로컬 필드와, 외부 외래 필드가 값은 동일함.
      // 변수명: area_data 로 하겠다.
      // 임의의 이름.
      as: "area_data",
    },
  },
  { $limit: 1 },
]);

// 조인의 2번째 복잡한 구조는
// 샘플 디비가 없는 관계로, 코드만 참고 하시고,

db.by_month.aggregate([
  {
    //새로운 필드 추가.
    $addFields: {
      "month_data.city_or_province": "$city_or_province",
      "month_data.county": "$county",
    },
  },
  {
    // 변결할 필드를 선택하는 부분,
    $replaceRoot: {
      newRoot: {
        $arrayElemAt: ["$month_data", 2],
      },
    },
  },
]);

// 랜덤하게 문서 가져오기.
예시;
db.rating.aggregate([
  {
    $sample: { size: 3 },
  },
]);

// 형식
// {
//  $sortByCount : <expression>
// }

// 예시;
db.rating.aggregate([
  {
    $sortByCount: "$rating",
  },
]);

실습하기. 

-> 각 문제 1 ~ 3 , 구조 이해하기.
-> 이해한 부분 중에서, 콤파스 툴
-> 각 공공데이터 컬렉션 중에서, 궁금한 필드 부분 
추가해서, 출력해보기. 
예) 
1 문제, 평균, 최대, 최소로 변경해서 실행 해보기. 
2 문제, 올해 -> 작년 변경, 지출이 가장 작은 지역명 기준
샘플을 3개정도 뽑아보기. 
3 문제, 구조 및 각 스테이지 이해하기. 



1. 하
1차 자치단체(city_or_province) 컬렉션에서 
facet -> 배열로 바꾸는 부분(하나의 값으로)
 스테이지를 이용하여
 
조건1
자치단체별(city_or_province)로 
총 사용한 운영비를 구하고, 
조건2
세부항목별(sub_category)로
총 사용한 운영비를 구해서 
하나의 도큐먼트로 표시하기. 
-> facet 스테이지 내부에서 
group 스테이지를 이용하여 
city_or_province와 sub_category로 
묶기. 

->
db.city_or_province.aggregate([
 {
  $facet: {
  // 임시 필드, 구분하는 기준, 1차 시,도 구분 한다는 의미.
   by_city_or_province: [
    {
	 $group: {
	 // _id 를 기준으로 그룹을 나누기. 
	  _id: "$city_or_province",
	  // 임시 필드명: sum_expenses
	  // 올해 운영비 지출 총합 나타냄. 
	  sum_expenses: {$sum: "$this_term_expense"}
	  }
	 }
	],
	// 임시 필드, 나누는 기준, 하위 카테고리를 기준으로 나누겠다. 
	
	by_sub_category: [
	 {
	  $group: {
	  // _id : 기준으로 그룹 나누기. 
	   _id: "$sub_category",
	   // main_category 임시 필드 
	   // main_category 의 값의 첫번째 요소를 가져옴
	   main_category: {$first: "$main_category"},
	   // sum_expenses this_term_expense 올해 운영비의 합산.
	   sum_expenses: {$sum: "$this_term_expense"},
	   }
	  }
	 ]
	}
}
])



2. 중 
1차 자치단체를 랜덤하게 두 곳을 골라 올해 
가장 많이 사용한 운영비 세부항목을 표시하기. 
->
1) city_or_province 컬렉션의 도큐먼트를 
올해 운영비 내림차순으로 정렬. 
2) 지역명으로 그룹화 하면서 첫 번째 도큐먼트 정보 남김. 
3) 2개의 도큐먼트를 랜덤하게 뽑기. 
->
city_or_province : 1차 직역 명( 시, 도)
db.city_or_province.aggregate([
 {
 // 정렬, 기준, 올해 운영비 지출 높은 순, -1: 내림차순.
  $sort: {this_term_expense:-1}
  },
   {// 2번째 스테이지, 그룹 나누기,
   
   $group: {
   //city_or_province : 1차 , 시,도 나누기. 
    _id: "$city_or_province",
	// main_category 임시필드의 값으로 첫번째 요소가지고옴
	main_category: {$first: "$main_category"},
	// sub_category 임시필드의 값으로 첫번째 요소가지고옴
	sub_category: {$first: "$sub_category"},
	// this_term_expense 임시필드의 값으로 첫번째 요소가지고옴
	this_term_expense: {$first: "$this_term_expense"}
	}
  },
  { //2개의 크기의 샘플로 랜덤하게 출력.
   $sample: {
    size : 2
   }
  }
])





3. 최상 
-전국 2차 자치단체의 이름, 총 예산, 주민등록 
인구를 하나의 도큐먼트로 정리해서 출력하기. 
- 2차 자치단체 이름이ㅣ 두번 이상 쓰인 곳은 
제외하고 출력해야함. 
- 임베디드 구조가 없는 형식으로 출력해야 함. 

-> unwind 와 addFields로 인구 정보와 예산정보를 합치는 방법 

1) local 컬렉션을 2차 자치단체명으로 그룹화 
2) population 컬렉션 과 2차 자치단체명으로 조인한다. 
3) 2차 자치단체명이 중복되는 지역을 제외한다. 
4) 조인된 배열 속 임베디드 도큐먼트에 예산 정보를 추가한다. 
5) replaceRoot 스테이지로 임베디드 도큐먼트를 도큐먼트 자체로 
변경하기. 

->
db.local.aggregate([
 {
  $group: {
   _id: "$local_government",
   expense: {$sum : "$this_term_expense"}
   }
   },
  {
   $lookup: {
    from: "population",
	localField: "_id",
	foreignField: "local_government",
	as: "population_data"
	}
	}
	,
   {
    $match: {population_data: {$size:1}}
   },
   {
    $unwind: "$population_data"
   },
   {
    $addFields: {
	 "population_data.expense": "$expense"
	}
   }
   ,
   {
    $replaceRoot : {
	 newRoot: "$population_data"
	}
   }
   
])
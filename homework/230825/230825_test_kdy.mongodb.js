// 전국의 "차대차" 사고에서 100회이상 사고가 났고, 사망자수가 0회인 지역 출력

use("car_accident");
db.by_type.find(
  //쿼리
  { type: "차대차", accident_count: { $gte: 100 }, death_toll: 0 },
  //프로젝션
  { county: 1, city_or_province: true }
);

// 전국의 "차대사람" 사고 중에서 사망자수가 0회 이거나, 중상자수 0회인 지역 출력
db.by_type.find(
  {
    type: "차대사람",
    $or: [{ death_toll: 0 }, { heavy_injury: 0 }],
  }, //쿼리부분
  { county: 1, city_or_province: true } // 프로젝션
);

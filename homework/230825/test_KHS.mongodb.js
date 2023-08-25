use("car_accident");

//1) 전국의 "차대차" 사고에서 100회 이상 사고가 났고, 사망자수가 0회인 지역 출력하기
db.by_type.find(
  { type: "차대차", accident_count: { $gte: 100 }, death_toll: 0 },
  {
    _id: false,
    county: 1,
    city_or_province: true,
    accident_count: 1,
    death_toll: 1,
  }
);

//2) 전국의 "차대사람" 사고에서 사망자수가 0회 이거나, 중상자수가 0회인 지역 출력하기
use("car_accident");
db.by_type.find(
  {
    type: "차대사람",
    $or: [{ death_toll: 0 }, { heavy_injury: 0 }],
  },
  {
    _id: false,
    county: 1,
    city_or_province: true,
    death_toll: 1,
    heavy_injury: 1,
  }
);

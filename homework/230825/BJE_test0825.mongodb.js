// 전국의 차대차 사고에서 100회이상 사고가 났고, 사망자 수가 0회인 지역 출력
// by_type   type

use("car_accident");
db.by_type.find(
  {
    type: "차대차",
    accident_count: { $gt: 100 },
    death_toll: 0,
  },
  {
    city_or_province: true,
  }
);

// 전국의 차대사람 사고중에서 사망자수가 0회이거나 중상자수가 0회인 지역 출력하기
// death_toll
// heavy_injury

use("car_accident");
db.by_type.find(
  {
    $or: [
      { death_toll: { $in: [0] } },
      {
        heavy_injury: { $in: [0] },
      },
    ],
  },
  {
    city_or_province: true,
  }
);

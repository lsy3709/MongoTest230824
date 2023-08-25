//0825 실습

//1.전국의 "차대차" 사고 중에서, 100회이상 사고가 발생했고, 사망자수가 0회인 지역 출력하기
db.by_type.find(
  { type: "차대차", accident_count: { $gte: 100 }, death_toll: 0 },
  {
    city_or_province: true,
    county: true,
    accident_count: true,
    death_toll: true,
  }
);

//2.전국의 "차대사람" 사고 중에서 사망자수가 0회이거나, 중상자수 0회인 지역 출력하기
db.by_type.find(
  { type: "차대사람", $or: [{ death_toll: 0 }, { heavy_injury: 0 }] },
  {
    city_or_province: true,
    county: true,
    death_toll: true,
    heavy_injury: true,
  }
);

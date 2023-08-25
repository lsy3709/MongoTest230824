use('car_accident');

// 전국의  ‘차대차‘  사고에서  100회  이상  사고가  났지만  사망자  수가  0회인  지역을  추출
db.by_type.find({ type: '차대차', accident_count: { $gte: 100 } });

// 전국의  ‘차대사람’ 사고  중에서  사망자수가  0회이거나  중상자수가  0회인  지역을  출력
db.by_type.find({ type: '차대사람', $or: [{ casualties: 0 }, { heavy_injury: 0 }] });

//  ‘차대사람’ 사고  중에서  사망자수가  0회이거나  중상자수가  100회인  지역을  출력
db.by_type.find({ type: '차대사람', $or: [{ casualties: 0 }, { heavy_injury: 100 }] });

// 검색 결과
// {
//   _id: ObjectId("5c89102b0da47a850775de31"),
//   area_id: ObjectId("5c88f9f70da47a8507752858"),
//   city_or_province: '대전',
//   county: '대덕구',
//   type: '차대사람',
//   accident_count: 244,
//   casualties: 236,
//   death_toll: 16,
//   heavy_injury: 100,
//   injury_report: 16,
//   light_injury: 120
// }

//mnthdata 자료만 출력하기
db.by_month.find({}, { month_data: 1 });

use('car_accident');

// 전국의  ‘차대차‘  사고에서  100회  이상  사고가  났지만  사망자  수가  0회인  지역을  추출
db.by_type.find({ type: '차대차', accident_count: { $gte: 100 } });

// 전국의  ‘차대사람’ 사고  중에서  사망자수가  0회이거나  중상자수가  0회인  지역을  출력
db.by_type.find({ type: '차대사람', $or: [{ casualties: 0 }, { heavy_injury: 0 }] });
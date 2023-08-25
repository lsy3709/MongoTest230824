db.by_type.find();
// 1) 전국의 "차대차" 사고에서 100회이상 사고가 났고, 사망자수가 0회인 지역 출력하기.
// 힌트.
// db.by_type.find(
// //쿼리
// {type:"차대차", accident_count : {조건1 }, death_toll : 조건2 },
//프로젝션
// {도:1, 1차 지역명(시군구):true }
db.by_type.find(
  {
    type: "차대차",
    accident_count: { $gt: 100 },
    death_toll: 0,
  },
  { city_or_province: 1, county: true }
);

// 2) 전국의 "차대사람" 사고 중에서 사망장수가 0회 이거나, 중상자수 0회인 지역 출력하기.
// 힌트.
// db.by_type.find(
// {type : "차대사람",
// $or : [{조건1}, {조건2}] }, //쿼리부분
// { 도:1, 1차 지역명(시군구):true } // 프로젝션
// )
// p14 참고.
// ex)
// db.by_month.find({$and: [
// {month_data: {$elemMatch: {month: "01월", heavy_injury: 0}}},
// {month_data: {$elemMatch: {month: "02월", death_toll: 0}}}
// ]})
db.by_type.find(
  { type: "차대사람", $or: [{ death_toll: 0 }, { heavy_injury: 0 }] }, //쿼리부분
  { city_or_province: 1, county: true } // 프로젝션
);

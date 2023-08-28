//1). 차대차 사고에서 100회이상 사고가 났고, 사망자수가 0회인 지역 출력
db.by_type.find(
    { type : "차대차",
        $and: [{ accident_count: { $gt: 100 } }, { death_toll: 0 }] },
    {_id:false, city_or_province:true, county: 1}
);

//2) 전국 "차대사람" 사고 중에서 사망자수 0회이거나, 중상자수0회인 지역
db.by_type.find(
    {type : "차대사람",
        $or: [{death_toll : 0}, {heavy_injury :0}]},
    {_id:false, city_or_province:true, county:1}
);


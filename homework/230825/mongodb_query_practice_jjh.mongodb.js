use("test");

db.by_type.find(
    {type : "차대차", accident_count : {"$gte" : 100}, death_toll : 0},
    {county : 1, city_or_province : true, _id : 0}
);

db.by_type.find(
    {type : "차대사람", "$or" : [{death_toll : 0}, {heavy_injury : 0}]},
    {county : true, city_or_province : true, _id : 0, area_id : false}
)
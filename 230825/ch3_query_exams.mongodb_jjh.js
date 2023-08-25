// 자동차 관련 공공데이터 활용 //
// _id값은 false로 지정하지 않는 이상
// 항상 출력되는 기본값임
use("car_accident");
db.by_road_type.find(
    {county : "강릉시"}, 
    {"_id" : 0 , "교차로내.accident_count" : true}
);

// find(쿼리, 프로젝션)
use("car_accident");
db.by_road_type.find(
    {"횡단보도부근.death_toll" : 0},
    {_id : false, city_or_province : true, county : 1}
);


use("car_accident");
db.by_road_type.countDocuments(
    {county : "강릉시"}
);

use("car_accident");
db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"] },
    { item: "notebook", qty: 50, tags: ["red", "blank"] },
    { item: "paper", qty: 100, tags:["red", "blank","green"] },
    { item: "planner", qty: 75, tags: ["blank", "red"] },
    { item: "postcard", qty: 45, tags: ["blue"] }    ]);

use("car_accident");
db.inventory.find();
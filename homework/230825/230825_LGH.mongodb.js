db.by_type.find(
  { type: "차대차", accident_count: { $gte: 100 }, death_toll: 0 },
  { city_or_province: 1, county: true }
);

db.by_type.find(
  { type: "차대사람", $or: [{ death_toll: 0 }, { heavy_injury: 0 }] },
  { city_or_province: 1, county: true }
);

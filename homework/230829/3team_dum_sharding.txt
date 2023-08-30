3team_data_sharding

mongos> sh.status()
--- Sharding Status ---
  sharding version: {
        "_id" : 1,
        "minCompatibleVersion" : 5,
        "currentVersion" : 6,
        "clusterId" : ObjectId("64edb0fb73d4852999be3451")
  }
  shards:
        {  "_id" : "shard0",  "host" : "shard0/10.100.103.27:27057,10.100.103.43:27055,10.100.103.49:27056,10.100.103.76:27054",  "state" : 1 }
  active mongoses:
        "4.4.24" : 1
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  0
        Migration Results for the last 24 hours:
                No recent migrations
  databases:
        {  "_id" : "car_accident",  "primary" : "shard0",  "partitioned" : false,  "version" : {  "uuid" : UUID("34f41635-c72a-4785-ac2d-a2b3c6b1922b"),  "lastMod" : 1 } }
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
                config.system.sessions
                        shard key: { "_id" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shard0  1024
                        too many chunks to print, use verbose if you want to force print
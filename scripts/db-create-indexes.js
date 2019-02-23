db.getCollection("sensorData").createIndex({ type: 1, "payload.ts": -1 });
db.getCollection("sensorDataMock").createIndex({ type: 1, "payload.ts": -1 });
db.getCollection("sensorDataMock").createIndex({ "payload.ts": 1 });

db.getCollection('sensorDataMock').find({}).forEach(function(doc) {
    db.getCollection('sensorData').insertOne(doc);
});
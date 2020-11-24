
ObjectId = require('mongodb').ObjectID

const getSensorDetails = (request, response) => {
    const collection = request.mongodb.collection("sensor");
    collection.find({"_id": ObjectId(request.params.id)}).toArray(function (err, docs) {
        if(err){
            console.log(err);
            response.json({ status: "error", reason: err });
        }
        else{
            console.log("Found the following records");
            console.log(docs);
            if(docs.length === 0){
                response.json({ status: "error", reason: "sensor is not present" });
            }
            else{
                response.json({ status: "success", reason: "sensor details", sensors: docs[0]});
            }
        }
    });
}

const getSensorTypeAndUnit = (request, response) => {
    const collection = request.mongodb.collection('sensor_type_unit_map');
    collection.find({}).toArray(function (err, docs) {
        if(err){
            console.log(err);
            response.json({ status: "error", reason: err });
        }
        else{
            console.log("Found the following records");
            console.log(docs);
            if(docs.length === 0){
                response.json({ status: "error", reason: "no sensors in this warehouse" });
            }
            else{
                response.json({ status: "success", reason: "sensor details", sensors: docs});
            }
        }
    });
}

const getSensorHistory = (request, response) => {
    const collection = request.mongodb.collection('sensor_history');
    collection.find({"sensor_id":request.params.id}).toArray(function(err, docs) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            console.log(docs);
            response.json({ status: "success", reason: "retrieved sensor history successfully", sensor_history: docs});
        }
      })
}


//TODO: dont add if sensor is unavailable
const addFakeSensorHistory = (request, response) => {
    const collection = request.mongodb.collection('sensor_history');
    const data = {
        sensor_id:request.params.id,
        dateTime: new Date(),
        value: Math.floor(Math.random()*100)
    }
    collection.insertOne(data, function(err, docs) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            response.json({ status: "success", reason: "added sensor history successfully"});
        }
      });
}

//request should contain warehouse_id also check whether warehouse ID exists before inserting 
const addSensorInWarehouse = (request, response) => {
    const collection = request.mongodb.collection('sensor');
    collection.insertOne(request.body, function(err, docs) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            response.json({ status: "success", reason: "added sensor successfully"});
        }
      });
}

const deleteSensor = (request, response) => {
    const collection = request.mongodb.collection('sensor');
    collection.deleteOne({ "_id": ObjectId(request.params.id) }, function(err, docs) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            response.json({ status: "success", reason: "deleted sensor successfully"});
        }
      });
}

const updateSensor = (request, response) => {
    console.log(request.body);
    delete request.body._id
    const collection = request.mongodb.collection('sensor');
    collection.updateOne({ "_id": ObjectId(request.params.id) }, { $set: request.body }, function(err, result) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            response.json({ status: "success", reason: "updated sensor successfully" });
        }
      });
}

module.exports={getSensorDetails, getSensorTypeAndUnit, getSensorHistory, addFakeSensorHistory, addSensorInWarehouse, deleteSensor, updateSensor}

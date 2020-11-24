ObjectId = require('mongodb').ObjectID
const tableName = "smartsupplychain_db.users";

const getAllWarehouses = (request, response) => {
    const collection = request.mongodb.collection("warehouse");
    collection.find({}).toArray(function (err, docs) {
        if(err){
            console.log(err);
            response.json({ status: "error", reason: err });
        }
        else{
            console.log("Found the following records");
            console.log(docs);
            if(docs.length === 0){
                response.json({ status: "error", reason: "no results found" });
            }
            else{
                response.json({ status: "success", reason: "list of warehouses", warehouses: docs});
            }
        }
    });
}

const getWarehousesForCustomer = (request, response) => {
    const collection = request.mongodb.collection("warehouse");
    let sql = `SELECT warehouse_id FROM ${tableName} WHERE email='${request.params.email}'`;
    request.sqldb.query(sql, (err, result) => {
        if (err) {
        console.log(err);
        response.json({ status: "error", reason: err });
        } else {
        if (result.length == 0) {
            response.json({ status: "error", reason: "user not found" });
        } else {
            console.log("type of ?", result[0].warehouse_id);
            if(JSON.parse(result[0].warehouse_id).length === 0){
                response.json({ status: "error", reason: "user has no warehouses" });
            }
            else{
                let warehouseArray = JSON.parse(result[0].warehouse_id)
                warehouseArray = warehouseArray.map((e)=>{
                    return ObjectId(e);
                })
                collection.find({"_id":{$in: warehouseArray}}).toArray(function (err, docs) {
                    if(err){
                        console.log(err);
                        response.json({ status: "error", reason: err });
                    }
                    else{
                        console.log("Found the following records");
                        console.log("DOCS???",docs);
                        if(docs.length === 0){
                            response.json({ status: "error", reason: "no warehouse results found" });
                        }
                        else{
                            response.json({ status: "success", reason: "list of warehouses for user", warehouses: docs});
                        }
                    }
                });
            }
        }
        }
    });
}

//also first check whether user can view this warehouse
const getAllSensorsForWarehouse = (request, response) => {
    const collection = request.mongodb.collection("sensors");
    collection.find({warehouse_id: request.params.id}).toArray(function (err, docs) {
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
                response.json({ status: "success", reason: "list of sensors in a warehouse", sensors: docs});
            }
        }
    });
}

const addWarehouse = (request, response) => {
    const collection = request.mongodb.collection('warehouse');
    collection.insertOne(request.body, function(err, result) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            const id = result.insertedId
            const sql_getWarehouseArray = `SELECT warehouse_id from ${tableName} where email='${request.body.email}'`
            request.sqldb.query(sql_getWarehouseArray, (err, result) => {
                if (err) {
                console.log(err);
                response.json({ status: "error", reason: err });
                } else {
                if (result.length == 0) {
                    response.json({ status: "error", reason: "user not found" });
                } else {
                    let warehouseArray = JSON.parse(result[0].warehouse_id||"[]");
                    warehouseArray.push(id);
                    const sql_updateWarehouseArray = `UPDATE ${tableName} SET warehouse_id='${JSON.stringify(warehouseArray)}' WHERE email='${request.body.email}';`
                    request.sqldb.query(sql_updateWarehouseArray, (err, result) => {
                        if (err) {
                        console.log(err);
                        response.json({ status: "error", reason: err });
                        } else {
                            response.json({ status: "success", reason: "added warehouse details successfully" });
                        }
                    });
                }
                }
            });
        }
      });
}

const deleteWarehouse = (request, response) => {
    const collection = request.mongodb.collection('warehouse');
    collection.deleteOne({ "_id": ObjectId(request.params.id) }, function(err, result) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            const sql_getWarehouseArray = `SELECT warehouse_id from ${tableName} where email='${request.body.email}'`
            request.sqldb.query(sql_getWarehouseArray, (err, result) => {
                if (err) {
                console.log(err);
                response.json({ status: "error", reason: err });
                } else {
                if (result.length == 0) {
                    response.json({ status: "error", reason: "user not found" });
                } else {
                    let warehouseArray = JSON.parse(result[0].warehouse_id||"[]");
                    warehouseArray.indexOf(request.params.id) >=0 ? warehouseArray.splice(warehouseArray.indexOf(request.params.id),1):null;
                    const sql_updateWarehouseArray = `UPDATE ${tableName} SET warehouse_id='${JSON.stringify(warehouseArray)}' WHERE email='${request.body.email}';`
                    request.sqldb.query(sql_updateWarehouseArray, (err, result) => {
                        if (err) {
                        console.log(err);
                        response.json({ status: "error", reason: err });
                        } else {
                            response.json({ status: "success", reason: "deleted warehouse successfully" });
                        }
                    });
                }
                }
            });
        }
      });
}

const updateWarehouse = (request, response) => {
    console.log(request.body);
    delete request.body._id
    const collection = request.mongodb.collection('warehouse');
    collection.updateOne({ "_id": ObjectId(request.params.id) }, { $set: request.body }, function(err, result) {
        if(err){
            console.log(err)
            response.json({ status: "error", reason: err });
        }
        else{
            response.json({ status: "success", reason: "updated warehouse successfully" });
        }
      });
}

module.exports={getAllWarehouses, getWarehousesForCustomer, getAllSensorsForWarehouse, addWarehouse, deleteWarehouse, updateWarehouse}

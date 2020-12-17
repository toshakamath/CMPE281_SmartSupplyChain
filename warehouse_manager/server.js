


var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); //need this to get req.body into json

var path = require('path');
var server = require('http').Server(app);

var sqlite = require("better-sqlite3");
var db = new sqlite("bankdatabase.db");


/*
//setup MongoDB database connection according to tosha file
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://root:root@cluster0.uymh0.mongodb.net/smartsupplychain_db?retryWrites=true&w=majority";
const dbName = 'smartsupplychain_db';

MongoClient.connect(url, function(err, client) {
    if(err){
        console.log(err);
        throw err;
    }
    console.log("Connected successfully to mongodb!");
    const db = client.db(dbName);
    cb(null, db);
  });
*/



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0.uymh0.mongodb.net/smartsupplychain_db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

client.connect(err => {
 
  console.log("client.connect testing");
  
});
/*
client.connect(err => {
  const collection = client.db("smartsupplychain_db").collection("warehouse");
  console.log("client.connect testing");
  collection.insertOne({name: 'testing'}, (err, result) => {console.log(err);});

  // perform actions on the collection object
  client.close();
});
*/



//MySQL Connection
const mysql = require("mysql");
const tableName = "sql3381783.users";

const con = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    port: "3306",
    user: "sql3381783",
    password: "TvKJIBNSCB"
  });


/*
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected successfully to mysql!");
  });
*/







// Set up the path for the quickstart.
var quickstartPath = path.join(__dirname, './quickstart/public');
app.use('/quickstart', express.static(quickstartPath));






app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './about.html'));
});


app.get('/admin', function(req, res){
    res.sendFile(path.join(__dirname, '/admin_page/admin.html'));
});



app.use(express.static(__dirname));




console.log('server running');

server.listen(process.env.PORT || 4000);



app.post('/login', function(req, res) {

	var login_info = req.body;

	console.log(req.body);



});


//const SmartNode = require('./smartNodeClass.js');
const SensorClass = require('./sensorClass.js');


var ArrayOfSmartNodes = [];

var intervalTracker = {};



const addWarehouseSensorData = db.prepare('INSERT INTO sensordata(warehouseid, sensorid, value, unit, time) VALUES (?, ?, ?, ?, ?)');
const addWarehouseSensor = db.prepare('INSERT INTO sensormetadata(sensorid, warehouseid, sensortype, status) VALUES (?, ?, ?, ?)');
const updateSensorStatus = db.prepare('UPDATE sensormetadata SET status = ? WHERE sensorid = ?');

const addWarehouseMetaData = db.prepare('INSERT INTO warehousemetadata(warehouseid, name, owner, city, longitude, latitude, cargoamount, schedule, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const removeWarehouseMetaData = db.prepare('DELETE FROM warehousemetadata WHERE warehouseid = ?');
const updateWarehouseSchedule = db.prepare('UPDATE warehousemetadata SET schedule = ? WHERE warehouseid = ?');
const updateWarehouseNodeStatus = db.prepare('UPDATE warehousemetadata SET status = ? WHERE warehouseid = ?');


function FindWarehouseSmartNodePosition(_warehouseID) {

	for (var i = 0; i < ArrayOfSmartNodes.length; i++) {

		if (ArrayOfSmartNodes[i].warehouseID == _warehouseID) {
			return i;
		};
	};

	return -1;
};





























//{"warehouseID":, "sensortype": "humidity"}
app.post('/addsensor', function(req, res){

	var addSensorRequest = req.body; console.log(req.body);

	var ind = FindWarehouseSmartNodePosition(addSensorRequest.warehouseID);


	if (ind > -1) {

		var newSensorID = generateID(6);

		var UpperCaseSensor = addSensorRequest.sensortype;
		UpperCaseSensor = UpperCaseSensor.toUpperCase();

		if (UpperCaseSensor == "LIGHT") {

			ArrayOfSmartNodes[ind].sensorList.push(new SensorClass.LightSensor(newSensorID));
			var sensorJSON = {"sensor_id": newSensorID, "sensor_type": addSensorRequest.sensortype, "sensor_unit": "Lux", "warehouse_id": addSensorRequest.warehouseID, "sensor_status": "Active"};

		} else if (UpperCaseSensor == "TEMPERATURE") {

			ArrayOfSmartNodes[ind].sensorList.push(new SensorClass.TemperatureSensor(newSensorID));
			var sensorJSON = {"sensor_id": newSensorID, "sensor_type": addSensorRequest.sensortype, "sensor_unit": "Fahrenheit", "warehouse_id": addSensorRequest.warehouseID, "sensor_status": "Active"};

		} else if (UpperCaseSensor == "HUMIDITY") {

			ArrayOfSmartNodes[ind].sensorList.push(new SensorClass.HumiditySensor(newSensorID));
			var sensorJSON = {"sensor_id": newSensorID, "sensor_type": addSensorRequest.sensortype, "sensor_unit": "RH (%)", "warehouse_id": addSensorRequest.warehouseID, "sensor_status": "Active"};

		};

		//for SQLlite
		//addWarehouseSensor.run(newSensorID, addSensorRequest.warehouseID, addSensorRequest.sensortype, "Active");

		//for mongoDB
		var collection = client.db("smartsupplychain_db").collection("sensor");
		collection.insertOne(sensorJSON, (err, result) => {console.log(err);});

		var message = "Successfully added " + addSensorRequest.sensortype + " sensor with ID: " + newSensorID + ".";

		var addSensorResponse = {"message": message};
	    

	 } else {

	 	var message = "Unable to add sensor to warehouse " + addSensorRequest.warehouseID + ".";

		var addSensorResponse = {"message": message};

	 };

	 res.json(addSensorResponse); //short for response.sendjson


}); //end app.post(/addsensor)




//{"sensorID": , "status": }
app.post('/updatesensorstatus', function(req, res){

	console.log(req.body);
	var sensorStatusRequest = req.body;


	var myQuery = {"sensor_id": sensorStatusRequest.sensorID};
	var newValues = { $set: { sensor_status: sensorStatusRequest.status } };
	var collection = client.db("smartsupplychain_db").collection("sensor");
	collection.updateOne(myQuery, newValues, (err, result) => {console.log(err);});

	var ind = FindWarehousePositionBySensorID(_sensorID);
	var ind2 = ArrayOfSmartNodes[ind].findSensorPositionInSensorList(sensorStatusRequest.sensorID);
	ArrayOfSmartNodes[ind].sensorList[ind2].status = sensorStatusRequest.status;


	/* for SQLlite
	var list = db.prepare("SELECT warehouseid FROM sensormetadata WHERE sensorid = '" + sensorStatusRequest.sensorID + "'").all();
	var ind = FindWarehouseSmartNodePosition(list[0].warehouseid);
	

	if (ind > -1) {

		var ind2 = ArrayOfSmartNodes[ind].findSensorPositionInSensorList(sensorStatusRequest.sensorID);

		ArrayOfSmartNodes[ind].sensorList[ind2].status = sensorStatusRequest.status;

		updateSensorStatus.run(sensorStatusRequest.status, sensorStatusRequest.sensorID);


		var message = "Successfully updated sensor " + sensorStatusRequest.sensorID + " status to: " + sensorStatusRequest.status;

		var updateSensorStatusResponse = {"message": message};
	    

	 } else {

	 	var message = "Unable to update " + sensorStatusRequest.sensorID + " status.";

		var updateSensorStatusResponse = {"message": message};

	 };


	*/

	 res.json(updateSensorStatusResponse); //short for response.sendjson


}); //end app.post(/updatesensorstatus)



//{"name":"Warehouse1", "owner": "Derek", "email": "jessica.hanso@email.com", "city": "San Jose", "longitude": 388384, "latitude": 304959, "cargoamount": 40, "schedule": 6000}
app.post('/addwarehouse', function(req, res){

	var warehouseNodeAddRequest = req.body;
	var newWarehouseID = generateID(4);

	ArrayOfSmartNodes.push(new SmartNode(newWarehouseID, warehouseNodeAddRequest.schedule));

	console.log(ArrayOfSmartNodes);

	intervalTracker[newWarehouseID] = setInterval(function() {SendData(newWarehouseID);}, warehouseNodeAddRequest.schedule);


	//for mongoDB
	warehouseNodeAddRequest["warehouse_id"] = newWarehouseID;
	warehouseNodeAddRequest["warehouse_status"] = "Active";

	var collection = client.db("smartsupplychain_db").collection("warehouse");
	collection.insertOne(warehouseNodeAddRequest, (err, result) => {console.log(err);});


	//for MySQL
    const id = newWarehouseID;
    const sql_getWarehouseArray = `SELECT warehouse_id from ${tableName} where email='${req.body.email}'`
    con.query(sql_getWarehouseArray, (err, result) => {
        if (err) {
        console.log(err);
        res.json({ status: "error", reason: err });
        } else {
        if (result.length == 0) {
            res.json({ status: "error", reason: "user not found" });
        } else {
            let warehouseArray = JSON.parse(result[0].warehouse_id||"[]");
            warehouseArray.push(id);
            const sql_updateWarehouseArray = `UPDATE ${tableName} SET warehouse_id='${JSON.stringify(warehouseArray)}' WHERE email='${req.body.email}';`
            con.query(sql_updateWarehouseArray, (err, result) => {
                if (err) {
                console.log(err);
                res.json({ status: "error", reason: err });
                } else {
                    res.json({ status: "success", reason: "added warehouse details successfully" });
                }
            });
        }
        }
    });



	//for SQLlite
	//addWarehouseMetaData.run(newWarehouseID, warehouseNodeAddRequest.name, warehouseNodeAddRequest.owner, warehouseNodeAddRequest.city, warehouseNodeAddRequest.longitude, warehouseNodeAddRequest.latitude, warehouseNodeAddRequest.cargoamount, warehouseNodeAddRequest.schedule, "on");
	/*

	var message = "Successfully connected warehouse smart node with id: " + newWarehouseID + ".";

	var warehouseNodeAddResponse = {"message": message};
    
    res.json(warehouseNodeAddResponse); //short for response.sendjson

    */

}); //end app.post(/addwarehouse)



//{"warehouseID":}
app.post('/removewarehouse', function(req, res){

	var warehouseNodeRemoveRequest = req.body;

	var ind = FindWarehouseSmartNodePosition(warehouseNodeRemoveRequest.warehouseID);

	if (ind > -1) {

		ArrayOfSmartNodes.splice(ind, 1);

		var myQuery = {"warehouse_id": warehouseNodeRemoveRequest.warehouseID};
		var newValues = { $set: { "warehouse_status": "Removed/Deleted" } };
		var collection = client.db("smartsupplychain_db").collection("warehouse");
		collection.updateOne(myQuery, newValues, (err, result) => {console.log(err);});

		//removeWarehouseMetaData.run(warehouseNodeRemoveRequest.warehouseID);

		var message = "Successfully removed warehouse smart node " + warehouseNodeRemoveRequest.warehouseID + ".";

	} else {
		var message = "Warehouse smart node " + warehouseNodeRemoveRequest.warehouseID + " does not exist.";
	};

	
	var removeWarehouseResponse = {"message": message};
    
    res.json(removeWarehouseResponse); //short for response.sendjson


}); //end app.post(/removewarehouse)




//{"warehouseID": , "schedule":}
app.post('/updatewarehouseschedule', function(req, res){

	var warehouseNodeScheduleUpdate = req.body;
	warehouseNodeScheduleUpdate.schedule = warehouseNodeScheduleUpdate.schedule * 1000; //convert to millisecond


	var ind = FindWarehouseSmartNodePosition(warehouseNodeScheduleUpdate.warehouseID);


	if (ind > -1) {

		clearInterval(intervalTracker[warehouseNodeScheduleUpdate.warehouseID]);

		ArrayOfSmartNodes[ind].schedule = warehouseNodeScheduleUpdate.schedule;

		intervalTracker[warehouseNodeScheduleUpdate.warehouseID] = setInterval(function() {SendData(warehouseNodeScheduleUpdate.warehouseID);}, warehouseNodeScheduleUpdate.schedule);


		var myQuery = {"warehouse_id": warehouseNodeScheduleUpdate.warehouseID};
		var newValues = { $set: { "schedule": warehouseNodeScheduleUpdate.schedule } };
		var collection = client.db("smartsupplychain_db").collection("warehouse");
		collection.updateOne(myQuery, newValues, (err, result) => {console.log(err);});


		//updateWarehouseSchedule.run(warehouseNodeScheduleUpdate.schedule, warehouseNodeScheduleUpdate.warehouseID);

		var message = "Successfully updated warehouse " + warehouseNodeScheduleUpdate.warehouseID + " schedule.";

	} else {
		var message = "Failed to update warehouse " + warehouseNodeScheduleUpdate.warehouseID + " schedule.";
	};


	var updateWarehouseScheduleResponse = {"message": message};
    
    res.json(updateWarehouseScheduleResponse); //short for response.sendjson

}); //end app.post(/updatewarehouseschedule)



//{"warehouseID": , "status":}
app.post('/updatewarehousenodestatus', function(req, res){
	
	console.log(req.body);
	var warehouseNodeStatusUpdate = req.body;

	var ind = FindWarehouseSmartNodePosition(warehouseNodeStatusUpdate.warehouseID);


	if (ind > -1) {

		ArrayOfSmartNodes[ind].status = warehouseNodeStatusUpdate.status;

		var myQuery = {"warehouse_id": warehouseNodeStatusUpdate.warehouseID};
		var newValues = { $set: { "warehouse_status": warehouseNodeStatusUpdate.status } };
		var collection = client.db("smartsupplychain_db").collection("warehouse");
		collection.updateOne(myQuery, newValues, (err, result) => {console.log(err);});	

		//updateWarehouseNodeStatus.run(warehouseNodeStatusUpdate.status, warehouseNodeStatusUpdate.warehouseID);

		var message = "Successfully updated warehouse " + warehouseNodeStatusUpdate.warehouseID + " status.";

	} else {
		var message = "Failed to update warehouse " + warehouseNodeStatusUpdate.warehouseID + " status.";
	};


	var updateWarehouseStatusResponse = {"message": message};
    
    res.json(updateWarehouseStatusResponse); //short for response.sendjson

}); //end app.post(/updatewarehousenodestatus)



//{"warehouseID": , "email": , "city": }
app.post('/updatewarehouseinfo', function(req, res){
	
	console.log(req.body);
	var warehouseUpdateInfo = req.body;
	var myQuery = {"warehouse_id": warehouseUpdateInfo.warehouseID};
	delete warehouseUpdateInfo.warehouseID;

	var arrayOfProperties = Object.keys(warehouseUpdateInfo);

	

	for (var i = 0; i < arrayOfProperties.length; i++) {

		/*
		if (arrayOfProperties[i] == "status") {
			var ind = FindWarehouseSmartNodePosition(myQuery["warehouse_id"]);
			ArrayOfSmartNodes[ind].status = warehouseNodeStatusUpdate.status;
		};
		*/

		var newValuesJSON = {};
		newValuesJSON[arrayOfProperties[i]] = warehouseUpdateInfo[arrayOfProperties[i]];
		var newValues = { $set: newValuesJSON };
		var collection = client.db("smartsupplychain_db").collection("warehouse");
		collection.updateOne(myQuery, newValues, (err, result) => {console.log(err);});	

	};

    
    res.json("Updated"); //short for response.sendjson

}); //end app.post(/updatewarehousenodestatus)
















app.get("/getallwarehousemetadata", function(req, res) {

	var list = db.prepare(`SELECT * FROM warehousemetadata`).all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")



//{"warehouseID": }
app.get("/getsinglewarehousemetadata", function(req, res) {

	var singleRequest = req.body;

	var list = db.prepare("SELECT * FROM warehousemetadata WHERE warehouseid = '" + singleRequest.warehouseID + "'").all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")



//{"username": }
app.post("/getwarehousemetadatabyuser", function(req, res) {

	var dataByUserReq = req.body;

	console.log(dataByUserReq);

	var list = db.prepare("SELECT * FROM warehousemetadata WHERE owner = '" + dataByUserReq.username + "'").all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")









app.get("/getallsensormetadata", function(req, res) {

	var list = db.prepare(`SELECT * FROM sensormetadata`).all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")


//{"warehouseID": }
app.post("/getsensormetadatabywarehouse", function(req, res) {

	var sensormetadatareq = req.body;

	var list = db.prepare("SELECT * FROM sensormetadata WHERE warehouseid = '" + sensormetadatareq.warehouseID + "'").all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")





app.get("/getallsensordata", function(req, res) {

	var list = db.prepare(`SELECT * FROM sensordata`).all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")



//{"username": }
app.post("/getsensormetadatabyuser", function(req, res) {

	var sensormetadatareq = req.body;

	var list = db.prepare("SELECT sensormetadata.sensorid, sensormetadata.warehouseid, sensormetadata.sensortype, sensormetadata.status FROM sensormetadata INNER JOIN warehousemetadata ON sensormetadata.warehouseid = warehousemetadata.warehouseid WHERE owner = '" + sensormetadatareq.username + "'").all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")


//{"username": }
app.post("/getsensordatabyuser", function(req, res) {

	var sensordatareq = req.body;

	var list = db.prepare("SELECT sensordata.sensorid, sensordata.warehouseid, sensordata.value, sensordata.unit, sensordata.time FROM sensordata INNER JOIN warehousemetadata ON sensordata.warehouseid = warehousemetadata.warehouseid WHERE owner = '" + sensordatareq.username + "'").all();

	console.log(list);
	res.json(list);

}); //end app.get("/getwarehousedata")





function FindWarehousePositionBySensorID(_sensorID) {

	for (var i = 0; i < ArrayOfSmartNodes.length; i++) {

		if (ArrayOfSmartNodes[i].findSensorPositionInSensorList(_sensorID) != -1) {
			return i;
		};

	}; //end for

	return -1;

}; //end function







function generateID(length) {

   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;

};



function SendData(_warehouseID) {

	var tempInd = FindWarehouseSmartNodePosition(_warehouseID);

	ArrayOfSmartNodes[tempInd].getSensorData();

};





class SmartNode {

	constructor(_warehouseID, _schedule) {

		this.warehouseID = _warehouseID;
		this.sensorList = [];
		this.schedule = _schedule;
		this.status = "Active";

	}



	findSensorPositionInSensorList(_sensorID) {

		for (var i = 0; i < this.sensorList.length; i++) {
			
			if (this.sensorList[i].sensorID == _sensorID) {
				return i;
			};
		};
	}; 



	addWarehouseSensor(_sensorObject) {
		this.sensorList.push(_sensorObject);
	};


	removeWarehouseSensor(_sensorID) {

		this.sensorList.splice(findSensorPositionInSensorList(_sensorID), 1);
	
	};


	updateSensorStatus(_sensorID, _status) {

		var q = findSensorPositionInSensorList(_sensorID);
		this.sensorList[q].status = _status;

	};


	updateSmartNodeStatus(_status) {

		this.status = _status;

	};



	updateSmartNodeSchedule(_schedule) {
		this.schedule = _schedule;
	};


	getSensorData() {

		if (this.sensorList.length > 0 && this.status == "Active") {

			var time = new Date().getTime();
			var date = new Date(time);
			var sensorData = 1;

			for (var i = 0; i < this.sensorList.length; i++) {

				if (this.sensorList[i].status == "Active") {
					sensorData = this.sensorList[i].getData();

					var sJSON = {"warehouse_id": this.warehouseID, "sensor_id": this.sensorList[i].sensorID, "value": sensorData.value, "measurementunit": sensorData.measurementUnit, "dateTime": date};

					var collectionSensorData = client.db("smartsupplychain_db").collection("sensor_history");
					collectionSensorData.insertOne(sJSON, (err, result) => {console.log(err);});

					console.log(this.warehouseID);
					console.log(this.sensorList[i].sensorID);
					console.log(sensorData.value);
					console.log(sensorData.measurementUnit);
					console.log(time);

				}; //end if
			} //end for
		}; //end if (this.sensorList.length....)
	}; //end getSensorData()


}; //end class Smart Node





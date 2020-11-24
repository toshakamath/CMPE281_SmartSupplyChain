

class Sensor {

	constructor(sensorID) {

		this.sensorID = sensorID;
		this.status = "Active";

	}


	updateStatus(newStatus) {
		this.status = newStatus;
	}

	updateSchedule(newSchedule) {
		this.schedule = newSchedule;
	}

	addWarehouseSmartNode(warehouseSmartNodeID) {
		this.warehouseSmartNodeList.push(warehouseSmartNodeID);
	}

	deleteWarehouseSmartNode(warehouseSmartNodeID) {
		var q = this.warehouseSmartNodeList.indexOf(warehouseSmartNodeID);
		if (q > -1) {
			this.warehouseSmartNodeList.splice(q, 1);
		}
	}



};





//https://www.engineeringtoolbox.com/light-level-rooms-d_708.html average illuminance
class LightSensor extends Sensor {

	constructor(_sensorID) {

		super(_sensorID);
		this.sensorDataArray = [50, 80, 121, 145, 146, 147, 148, 149, 150, 150, 150, 150, 
							   150, 150, 150, 150, 150, 150, 151, 152, 153, 154, 155, 160, 172, 203, 230];
		this.units = "Lux";

	};


	getData() {

		var tempIndex = Math.floor(Math.random() * this.sensorDataArray.length);

		var data = {"value": this.sensorDataArray[tempIndex], "measurementUnit": this.units};

		return data;

	};


};





class TemperatureSensor extends Sensor {

	constructor(_sensorID) {

		super(_sensorID);
		this.sensorDataArray = [50, 80, 121, 145, 146, 147, 148, 149, 150, 150, 150, 150, 150, 150, 150, 
		                        150, 150, 150, 151, 152, 153, 154, 155, 160, 172, 203, 230];
		this.units = "Fahrenheit";

	};


	getData() {

		var tempIndex = Math.floor(Math.random() * this.sensorDataArray.length);

		var data = {"value": this.sensorDataArray[tempIndex], "measurementUnit": this.units};

		return data;

	};


};








class HumiditySensor extends Sensor {

	constructor(_sensorID) {

		super(_sensorID);
		this.sensorDataArray = [45, 45, 45, 45, 53, 53, 53, 53, 60, 60, 60, 63, 63, 63, 65, 65, 65, 69, 
		                        69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 70, 71, 71, 71, 71, 73, 73, 73, 
		                        73, 75, 75, 75, 75, 82, 82, 82, 82, 91, 91, 91]; //60-75
		this.units = "Relative Humidity (%)";

	};


	getData() {

		var tempIndex = Math.floor(Math.random() * this.sensorDataArray.length);

		var data = {"value": this.sensorDataArray[tempIndex], "measurementUnit": this.units};

		return data;

	};


};




module.exports = {

  Sensor : Sensor,
  LightSensor : LightSensor,
  TemperatureSensor: TemperatureSensor,
  HumiditySensor: HumiditySensor

};









//https://stackoverflow.com/questions/51572081/js-class-method-in-a-setinterval-doesnt-work

/*
https://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-javascript
    var time = new Date().getTime();
    var date = new Date(time);
    alert(date.toString()); // Wed Jan 12 2011 12:42:46 GMT-0800 (PST)

*?











/*example code: const months = ["January", "February", "March", "April", "May", "June", "July"];

const random = Math.floor(Math.random() * months.length);
console.log(random, months[random]);
*/
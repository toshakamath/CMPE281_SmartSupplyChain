

class SmartNode {

	constructor(_warehouseID, _schedule) {

		this.warehouseID = _warehouseID;
		this.sensorList = [];
		this.schedule = _schedule;
		this.status = "on";

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

		if (this.sensorList.length > 0 && this.status == "on") {

			var time = new Date().getTime();
			var sensorData = 1;

			for (var i = 0; i < this.sensorList.length; i++) {

				if (this.sensorList[i].status == "Active") {
					sensorData = this.sensorList[i].getData();

					//sensorData is json format of {"value": , "measurementUnit":}
					addWarehouseSensorData.run(this.warehouseID, this.sensorList[i].sensorID, sensorData.value, sensorData.measurementUnit, time);

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




module.exports = SmartNode;
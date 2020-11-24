

var mylist = [];
var data = {"username": "Derek"};
var jsonData = JSON.stringify(data);
var rows = [];


$("table, th, td").attr("border", "1px solid black");


$.ajax({
    url: "http://localhost:4000/getsensormetadatabyuser",
    data: jsonData,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
  	success: function(response) {

    	console.log(response);
    	myList = response;
    	console.log(myList);


		  buildHtmlTable("#sensorlist2");

  	},
  	error: function(xhr) {
    	console.log("error occured");
  	}
}); //end ajax


$.ajax({
    url: "http://localhost:4000/getsensordatabyuser",
    data: jsonData,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);
      myList = response;
      console.log(myList);


      buildHtmlTable("#seeSensorData");

    },
    error: function(xhr) {
      console.log("error occured");
    }
}); //end ajax
















$("#seeSensorButton").on("click", function() {
	$("#seeSensorButton, #editSensorButton, #addSensorButton").css("background-color", "");

	$("#seeSensorData, #editSensors, #addSensors").hide();

	$("#seeSensorData").show();

	$(this).css("background-color", "#ffcccc");

});


$("#editSensorButton").on("click", function() {
  $("#seeSensorButton, #editSensorButton, #addSensorButton").css("background-color", "");

  $("#seeSensorData, #editSensors, #addSensors").hide();

  $("#editSensors").show();

  $(this).css("background-color", "#ffcccc");

});


$("#addSensorButton").on("click", function() {
  $("#seeSensorButton, #editSensorButton, #addSensorButton").css("background-color", "");

  $("#seeSensorData, #editSensors, #addSensors").hide();

  $("#addSensors").show();

  $(this).css("background-color", "#ffcccc");

});






$("#editSensorSubmit").on("click", function() {
  
  var editSensorID = $("#editSensorID").val();
  var editSensorNewStatus = $("#editSensorStatus").val();

  var editSensorJSON = {"sensorID": editSensorID, "status": editSensorNewStatus};

  editSensorJSON = JSON.stringify(editSensorJSON);



  $.ajax({

    url: "http://localhost:4000/updatesensorstatus",
    data: editSensorJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);
      window.location.href = 'sensor.html';

    },
    error: function(xhr) {
      console.log("error occured");
    }
  }); //end ajax



});




$("#addSensorSubmit").on("click", function() {
  
  var addSensorWareID = $("#addSensorWarehouseID").val();
  var addSensorType = $("#addSensorType").val();

  var addSensorJSON = {"warehouseID": addSensorWareID , "sensortype": addSensorType};

  addSensorJSON = JSON.stringify(addSensorJSON);



  $.ajax({

    url: "http://localhost:4000/addsensor",
    data: addSensorJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);
      window.location.href = 'sensor.html';

    },
    error: function(xhr) {
      console.log("error occured");
    }
  }); //end ajax



});




























$("#addwareSubmit").on("click", function() {

	var addname = $("#addname").val();
	var addcity = $("#addcity").val();
	var addcargo = $("#addcargo").val();
	var addschedule = ($("#addschedule").val() * 1000);

	var addJSON = {"name": addname, "owner": "Derek", "city": addcity, "cargoamount": addcargo, "schedule": addschedule};
	addJSON = JSON.stringify(addJSON);
	console.log(addJSON);

	$.ajax({
    url: "http://localhost:4000/addwarehouse",
    data: addJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
  	success: function(response) {

    	console.log(response);
    	window.location.href = 'warehouse.html';


  	},
  	error: function(xhr) {
    	console.log("error occured");
  	}


	}); //end ajax


});




$("#deletewareSubmit").on("click", function() {

	var deleteid = $("#deleteid").val();

	var deleteJSON = {"warehouseID": deleteid};
	deleteJSON = JSON.stringify(deleteJSON);

	$.ajax({
    url: "http://localhost:4000/removewarehouse",
    data: deleteJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
  	success: function(response) {

    	console.log(response);
    	window.location.href = 'warehouse.html';


  	},
  	error: function(xhr) {
    	console.log("error occured");
  	}


	}); //end ajax


});





$("#editwarescheduleSubmit").on("click", function() {
  var wareEditID = $("#editid").val();
  var editid = ($("#warescheduleid").val() * 1000);

  var editJSON = {"warehouseID": wareEditID, "schedule": editid};
  editJSON = JSON.stringify(editJSON);

  $.ajax({
    url: "http://localhost:4000/updatewarehouseschedule",
    data: editJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);
      window.location.href = 'warehouse.html';


    },
    error: function(xhr) {
      console.log("error occured");
    }


  }); //end ajax


});



$("#editwarestatusSubmit").on("click", function() {
  var wareEditID = $("#editid").val();
  var statusid = $("#warestatusid").val();

  var statusJSON = {"warehouseID": wareEditID, "status": statusid};

  statusJSON = JSON.stringify(statusJSON);

  console.log(statusJSON);

  $.ajax({
    url: "http://localhost:4000/updatewarehousenodestatus",
    data: statusJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);
      window.location.href = 'warehouse.html';


    },
    error: function(xhr) {
      console.log("error occured");
    }


  }); //end ajax


});







$("#getsensorsbywarehouse").on("click", function() {
  var sensorsWareID = $("#getsensorsid").val();

  var sensorsJSON = {"warehouseID": sensorsWareID};

  sensorsJSON = JSON.stringify(sensorsJSON);

  console.log(sensorsJSON);

  $.ajax({
    url: "http://localhost:4000/getsensormetadatabywarehouse",
    data: sensorsJSON,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    success: function(response) {

      console.log(response);

      myList = response;

      console.log(myList);

      buildHtmlTable("#sensorsdiv");

      //window.location.href = 'warehouse.html';


    },
    error: function(xhr) {
      console.log("error occured");
    }


  }); //end ajax


});











// Builds the HTML Table out of myList.
function buildHtmlTable(selector) {
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
    $(selector).append(row$);
  }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0; i < myList.length; i++) {
    var rowHash = myList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);

  return columnSet;
}


var mylist = [];
var data = {"username": "Derek"};
var jsonData = JSON.stringify(data);
var rows = [];


$("table, th, td").attr("border", "1px solid black");


$.ajax({
    url: "http://localhost:4000/getwarehousemetadatabyuser",
    data: jsonData,
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
  	success: function(response) {

    	console.log(response);
    	myList = response;

    	for (var i = 0; i < myList.length; i++) {

    		delete myList[i].owner;
    		delete myList[i].longitude;
    		delete myList[i].latitude;
 
    	};

    	console.log(myList);


		buildHtmlTable("#warehouselist2");

  	},
  	error: function(xhr) {
    	console.log("error occured");
  	}
}); //end ajax














$("#addW").on("click", function() {
	$("#addW, #editW, #deleteW, #sensorsW").css("background-color", "");

	$("#addwarehousediv, #deletewarehousediv, #editwarehousediv, #sensorsdiv").hide();

	$("#addwarehousediv").show();

	$(this).css("background-color", "#ffcccc");

});


$("#editW").on("click", function() {
	$("#addW, #editW, #deleteW, #sensorsW").css("background-color", "");

	$("#addwarehousediv, #deletewarehousediv, #editwarehousediv, #sensorsdiv").hide();

	$("#editwarehousediv").show();

	$(this).css("background-color", "#ffcccc");

});

$("#deleteW").on("click", function() {
	$("#addW, #editW, #deleteW, #sensorsW").css("background-color", "");

	$("#addwarehousediv, #deletewarehousediv, #editwarehousediv, #sensorsdiv").hide();

	$("#deletewarehousediv").show();

	$(this).css("background-color", "#ffcccc");

});

$("#sensorsW").on("click", function() {
	$("#addW, #editW, #deleteW, #sensorsW").css("background-color", "");

	$("#addwarehousediv, #deletewarehousediv, #editwarehousediv, #sensorsdiv").hide();

	$("#sensorsdiv").show();

	$(this).css("background-color", "#ffcccc");

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
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("./Config/mysqldb");
const mongo = require("./Config/mongodb");

const app = express();
const port = 3001;
const host = "localhost";

const user = require("./Controller/User");
const warehouse = require("./Controller/Warehouse");
const sensor = require("./Controller/Sensor");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mysql.setupMySqlDbConnection((err, mysql_connection) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    mongo.setupMongoDbConnection((err, mongodb_connection) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        app.use((req, res, next) => {
          req.sqldb = mysql_connection;
          next();
        });
        app.use((req, res, next) => {
          req.mongodb = mongodb_connection;
          next();
        });
        app.post("/login", user.login);
        app.get("/users", user.getAllCustomers);
        app.get("/user", user.getCustomerDetails);
        app.get("/warehouses", warehouse.getAllWarehouses);
        app.get("/warehouse/user/:email", warehouse.getWarehousesForCustomer);
        app.get("/warehouse/:id/sensors", warehouse.getAllSensorsForWarehouse);
        app.post("/warehouse", warehouse.addWarehouse);
        app.delete("/warehouse/:id", warehouse.deleteWarehouse);
        app.put("/warehouse/:id", warehouse.updateWarehouse);
        app.get("/sensor/constants", sensor.getSensorTypeAndUnit);
        app.get("/sensor/:id", sensor.getSensorDetails);
        app.get("/sensor/:id/history", sensor.getSensorHistory);
        app.post("/sensor/:id/history", sensor.addFakeSensorHistory);
        app.post("/sensor", sensor.addSensorInWarehouse);
        app.delete("/sensor/:id", sensor.deleteSensor);
        app.put("/sensor/:id", sensor.updateSensor);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

const mysql = require("mysql");

const con = mysql.createConnection({
    host: "35.223.197.22",
    user: "root",
    password: "",
  });

const setupMySqlDbConnection = (cb) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected successfully to mysql!");
    cb(null, con);
  });
}

module.exports = {setupMySqlDbConnection}
const mysql = require("mysql");

const con = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    port: "3306",
    user: "sql3381783",
    password: "TvKJIBNSCB",
  });

const setupMySqlDbConnection = (cb) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected successfully to mysql!");
    cb(null, con);
  });
}

module.exports = {setupMySqlDbConnection}
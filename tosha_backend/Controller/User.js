const tableName = "sql3381783.users";

let login = (request, response) => {
  console.log("request.BODY: ", request.body);
  let sql = `SELECT * FROM ${tableName} WHERE email='${request.body.email}' AND password='${request.body.password}'`;
  request.sqldb.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      response.json({ status: "error", reason: err });
    } else {
      if (result.length == 0) {
        response.json({ status: "error", reason: "user not found" });
      } else {
        console.log(result[0]);
        delete result[0].password
        response.json({ status: "success", reason: "logged in successfully", details:result[0] });
      }
    }
  });
};

let register = (request, response) => {
  console.log("request.BODY: ", request.body);
  let sql = `INSERT INTO ${tableName} (name,email,password,role,warehouse_id) VALUES ('${request.body.name}', '${request.body.email}', '${request.body.password}', '${request.body.role}','[]')`
  request.sqldb.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      response.json({ status: "error", reason: err });
    } else {
        console.log(result);
        response.json({ status: "success", reason: "registered user successfully", details:result[0] });
    }
  });
};

//update for get customers with role only supplier
let getAllCustomers = (request, response) => {
  let sql = `SELECT * FROM ${tableName}`;
  request.sqldb.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      response.json({ status: "error", reason: err });
    } else {
      if (result.length == 0) {
        response.json({ status: "error", reason: "no users found" });
      } else {
        console.log(result[0]);
        result.forEach((user) => {
          delete user.password;
        });
        response.json({
          status: "success",
          reason: "list of users",
          users: result,
        });
      }
    }
  });
};

let getCustomerDetails = (request, response) => {
  console.log("request.PARAMS: ", request.query);
  let sql = `SELECT * FROM ${tableName} WHERE email='${request.query.email}'`;
  request.sqldb.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      response.json({ status: "error", reason: err });
    } else {
      if (result.length == 0) {
        response.json({ status: "error", reason: "user not found" });
      } else {
        console.log(result[0]);
        delete result[0].password;
        response.json({ status: "success", reason: "user information", user_details:result[0] });
      }
    }
  });
};

module.exports = { login, register, getAllCustomers, getCustomerDetails };

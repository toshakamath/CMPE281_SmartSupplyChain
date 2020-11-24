const MongoClient = require('mongodb').MongoClient;

const setupMongoDbConnection = (cb) => {
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
}

module.exports = {setupMongoDbConnection}

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;
var DatabaseCon;
if (process.env.NODE_ENV=='dev') {
     DatabaseCon= 'mongodb+srv://aws-backend-dev:Devthecoder7*@cluster0-holxc.mongodb.net/db_pece?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
}else{
     DatabaseCon= 'mongodb+srv://aws-backend-dev:Devthecoder7*@cluster0-holxc.mongodb.net/db_pece_live?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
}
module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }

    console.log('=> using new database connection');
    // console.log('6656',process.env);
    return mongoose.connect(DatabaseCon)
        .then(db => {
            isConnected = db.connections[0].readyState;
        });
};
const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    google_calendar_connect_time: {
        type: String
    },
    connected_gmail: {
        type: String
    }
},{
    collection: 'data_pece'
});
module.exports = mongoose.model('data_pece', UsersSchema);
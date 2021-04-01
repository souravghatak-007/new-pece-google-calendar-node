const mongoose = require('mongoose');
const gapiSchema = new mongoose.Schema({
    code: {
        type: String
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    redirect_url: {
        type: String
    },
    create_on: {
        type: Number,
        default: Math.round((new Date()).getTime())
    }

})
module.exports = mongoose.model('gapi', gapiSchema);
const mongoose = require('mongoose');
const eventdaySchema = new mongoose.Schema({
    startdate: {
        type: String
    },
    starttime: {
        type: String
    },
    st: {
        type: String
    },
    endtime: {
        type: String
    },
    start_datetime_unix: {
        type: Number
    },
    description: {
        type: String
    },
    timezone: {
        type: String
    },
    meetingwith: {
        type: Boolean
    },
    timespan: {
        type: Number
    },
    is_onboarding: {
        type: Boolean
    },
    is_discovery: {
        type: Boolean
    },
    eventid: {
        type: Object
    },
    slots: {
        type: Array
    }
}, { collection: 'eventdayarr' })

module.exports = mongoose.model('eventdayarr', eventdaySchema);
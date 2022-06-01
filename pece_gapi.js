// gapi getauthorization code

'use strict';
require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const async = require("async");
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
var request = require('request');
const { google } = require('googleapis');
const Gapi = require('./models/gapi');
const Users = require('./models/users');
const eventdayarr = require('./models/eventdayarr');
const google_events = require('./models/google_events');

var moment = require('moment');
var momenttz = require('moment-timezone');
var momentrange = require('moment-range');
momentrange.extendMoment(moment);
var databaseName;
var Url;
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
}


let gapi_url;
let redirecturl

if (process.env.NODE_ENV == 'dev') {
    redirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/dev/getauthorization-pece-calender";
    gapi_url = 'https://dev.gapi.peceportal.com/getauthorization-pece';
} else {
    redirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/production/getauthorization-pece-calender";
    gapi_url = 'https://gapi.peceportal.com/getauthorization-pece';
}

// New Schema For Email 

var conn2 = mongoose.createConnection(process.env.FDB);
const email_all_data_schema = new mongoose.Schema({
    cc: {
        type: Array
    },
    subject: {
        type: String
    },
    bcc: {
        type: Array
    },
    recipients: {
        type: Array
    },
    body: {
        type: String
    },
    sender: {
        type: String
    },
    createdon_datetime: { type: Number, default: Math.round((new Date()).getTime()) }

}, { collection: 'allemailsqued' });
var model2 = conn2.model('allemailsqued', email_all_data_schema);




module.exports.auth = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    switch (event.pathParameters.path) {
        case 'test':
            test(event, context, callback);
            break;
    }
}


// get code from google (1)
exports.getgapicode = async (event) => {
    console.log('hit for code')
    // '853332811546-dp715m8offmbeh9c1scb34ddb0pup7rc.apps.googleusercontent.com',
    //     'qCJj8c3uljSs23k-AvMUnZZ9',
    // https://dev.gapi.peceportal.com/getauthorization-pece
    let peceredirecturl="";
    if (process.env.NODE_ENV == 'dev') {
        peceredirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/dev/calender-pece-auth";
    } else {
        peceredirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/production/calender-pece-auth";
    }
    console.log(peceredirecturl)

    const oauth2Client = new google.auth.OAuth2(
        '250468463154-spudurgmv24pc8ok059827u3ahr2qpb2.apps.googleusercontent.com',
        'qD8oMF-tHcl3QlxdV2UoNKj_',
        peceredirecturl
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ["https://www.googleapis.com/auth/calendar.events.owned", "https://www.googleapis.com/auth/userinfo.email"],
        prompt: 'consent',
    });

    const responce = {
        statusCode: 301,
        headers: {
            Location: url,
        }
    };

    console.log(url, '++++>>url')
    return responce;
}



// redirect website with google auth code (2)
exports.gapi = async (event) => {
    var query_code = event.queryStringParameters.code;

    var code = decodeURIComponent(query_code);

    console.log(code, 'code new +_+')
    if (process.env.NODE_ENV == 'dev') {
        databaseName = "db_pece";
        // sourceName = "PECE<support@dev.peceportal.com>";
        Url = "https://dev.peceportal.com/";
        // LoginUrl = "https://dev.peceportal.com/";
    } else {
        databaseName = "db_pece_live";
        // sourceName = "PECE<support@peceportal.com>";
        Url = "https://peceportal.com/";
        // LoginUrl = "https://peceportal.com/";

    }
    var redirect_url = Url + 'tech/manage-calender/manage-sehedule' + '?' + 'code=' + code;
    console.log(redirect_url)
    const responce = {
        statusCode: 301,
        headers: {
            Location: redirect_url,
        }
    };
    console.log(redirect_url, ' gapi ++++>>redirect_url 1')
    return responce;

};



// update google auth access and refresh token with code (3)
// hit this endpoint from client site

exports.updateGoogleApiToken = (event, context, callback) => {

    // console.log(event, 'event')

    context.callbackWaitsForEmptyEventLoop = false;
    let req = JSON.parse(event.body);
    var user_id = mongoose.Types.ObjectId(req.user_id);

    var redirect_url = 'https://backoffice.troywenning.com/calendar-management/calendar' + '?' + 'code=' + req.gapi_access_code;
    let peceredirecturl="";
    if (process.env.NODE_ENV == 'dev') {
        peceredirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/dev/calender-pece-auth";
    } else {
        peceredirecturl = "https://88xgiycoeg.execute-api.us-east-1.amazonaws.com/production/calender-pece-auth";
    }
    // console.log(code, 'hit with code  ===?  addGoogleApiToken')

    request.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
            "code": req.gapi_access_code,
            "redirect_uri": peceredirecturl,
            "client_id": "250468463154-spudurgmv24pc8ok059827u3ahr2qpb2.apps.googleusercontent.com",
            "client_secret": "qD8oMF-tHcl3QlxdV2UoNKj_",
            "grant_type": "authorization_code"
        }
    }, function (error, response, body) {
        console.log(response.body, 'xxxxxxx')

        const resData = JSON.parse(response.body);

        // console.log(redirect_url, 'redirect_url 1')
        console.log(resData, 'resData 1')

        let DataSet = {
            access_token: resData.access_token,
            refresh_token: resData.refresh_token,
            code: req.gapi_access_code,
            redirect_url: redirect_url
        }

        connectToDatabase()
            .then(() => {
                Gapi.create(DataSet)
                    .then(note => {
                        console.log(note, "note add gapi data ++ ")

                        // console.log(note.access_token, 'access_token==')

                        if (note.access_token != null && typeof (note.access_token) != "undefined" && note.refresh_token != null && typeof (note.refresh_token) != "undefined") {

                            note.google_calendar_connect_time = req.google_calendar_connect_time;

                            Users.findOneAndUpdate({ _id: user_id }, { $set: { calendar_token: note, access_token: note.access_token, refresh_token: note.refresh_token, google_calendar_connect_time: note.google_calendar_connect_time } }, function (err, items) {
                                // console.log('token updated successfully ++')
                                callback(null, {
                                    headers: headers,
                                    statusCode: 200,
                                    body: JSON.stringify({ "status": "success", "results": note, "body": body })
                                })
                            })
                        } else {
                            callback(null, {
                                headers: headers,
                                statusCode: 200,
                                body: JSON.stringify({ "status": "error", "results": 'invalid access code', "body": body })
                            })
                        }
                    })
            })
    });
}


//update user goggle connect email

exports.updategoogleconnectemail = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let req = JSON.parse(event.body);

    let user_id = mongoose.Types.ObjectId(req.user_id);


    connectToDatabase()
        .then(() => {
            Users.findOneAndUpdate({ _id: user_id }, { $set: { connected_gmail: req.google_connected_gmail } }, function (err, items) {
                console.log('google_connected_gmail updated successfully ++')

                if (!err) {
                    callback(null, {
                        headers: headers,
                        statusCode: 200,
                        body: JSON.stringify({ "status": "success" })
                    })
                } else {
                    callback(null, {
                        headers: headers,
                        statusCode: 200,
                        body: JSON.stringify({ "status": "error", "results": err, })
                    })
                }

            })
        })
};



// google calendar event
exports.googlecalendarevent = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    let req = JSON.parse(event.body);

    console.log('googlecalendar++++', event.pathParameters.path)

    let oauth2Client = new google.auth.OAuth2(
        '853332811546-dp715m8offmbeh9c1scb34ddb0pup7rc.apps.googleusercontent.com',
        'qCJj8c3uljSs23k-AvMUnZZ9',
        gapi_url
    );

    //get access token using refresh token
    request.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
            "client_id": "853332811546-dp715m8offmbeh9c1scb34ddb0pup7rc.apps.googleusercontent.com",
            "client_secret": "qCJj8c3uljSs23k-AvMUnZZ9",
            "refresh_token": req.refresh_token,
            "grant_type": "refresh_token"
        }
    }, function (error, response, body) {
        // console.log('body====', body, 'response++++', response, 'err', error, response.body)
        // console.log(response.body, '+++++++++++++++++++++++')
        let responseData = JSON.parse(response.body);
        // console.log(responseData.access_token, '??????????????/')
        if (responseData.access_token != null && responseData.access_token != '') {

            // console.log('success', 's++++')

            oauth2Client.credentials = JSON.parse(response.body);

            switch (event.pathParameters.path) {
                case 'check-ability':
                    listEvents(oauth2Client, req, callback);
                    break;
                case 'add-to-calendar':
                    insertEvents(oauth2Client, req, callback);
                    break;
                case 'update-booked-event':
                    updateEvents(oauth2Client, req, callback);
                    break;
                case 'delete-booked-event':
                    deleteEvents(oauth2Client, req, callback);
                    break;
            }
        } else {
            console.log(error, 'err++++====')
            callback(null, {
                headers: headers,
                statusCode: 200,
                body: JSON.stringify({ "status": "error", "results": response.body, })
            })
        }
    })
};


//list event from google calendar
function listEvents(auth, req, callback) {
    let calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
        timeMin: req.start,
        timeMax: req.end
    }, (err, res) => {
        if (err) {
            return console.log('The API returned an error: ' + err);
        }
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                console.log(' event.start.dateTime ' + event.start.dateTime);
                console.log(' event.start.date ' + event.start.date);
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }

        // events.length = 0;

        callback(null, {
            headers: headers,
            statusCode: 200,
            body: JSON.stringify(events.length)
        })
    });
};


//add event into google calendar
function insertEvents(auth, req, callback) {
    let calendar = google.calendar({ version: 'v3', auth });

    var event = {
        'summary': req.event_title,
        'location': req.timezoneName,
        'description': req.description,
        'start': {
            'dateTime': req.startDateTime,
            'timeZone': req.timezone,
        },
        'end': {
            'dateTime': req.endDateTime,
            'timeZone': req.timezone,
        },
        'attendees': [
            // { 'email': req.bookingUserEmail }
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
    };

    console.log(event, 'create event++')

    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
        sendNotifications: true
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            callback(null, {
                headers: headers,
                statusCode: 200,
                body: JSON.stringify({ "status": "error", "results": err, })
            })
            return;
        } else {
            console.log('Event created: %s', event.htmlLink, 'Event++++', event);

            // callback(null, {
            //     headers: headers,
            //     statusCode: 200,
            //     body: JSON.stringify({ "status": "success", "results": event, })
            // })

            var o_id = mongoose.Types.ObjectId(req.eid);

            // event = JSON.parse(event);

            req.id = mongoose.Types.ObjectId(req.bookingUserId);

            req.emailid = req.bookingUserEmail;

            if (req.training_id != null && req.training_id != '' && typeof (req.training_id) != 'undefined') {
                req.training_id = mongoose.Types.ObjectId(req.training_id);
                console.log(req.training_id, 'req.training_id++++++++++++')
            }

            if (req.lesson_id != null && req.lesson_id != '' && typeof (req.lesson_id) != 'undefined') {
                req.lesson_id = mongoose.Types.ObjectId(req.lesson_id);
            }

            if (req.product_id != null && req.product_id != '' && typeof (req.product_id) != 'undefined') {
                req.product_id = mongoose.Types.ObjectId(req.product_id);

            }

            req.eid = mongoose.Types.ObjectId(req.eid);

            req.googleevent = event.data.id;

            // console.log(o_id, 'e_id+++', req.googleevent);

            Users.findOneAndUpdate({ _id: req.id }, { $set: { event_type: req.event_type } }, function (err, items) {
                console.log('token updated successfully ++')
            })


            connectToDatabase()
                .then(() => {
                    eventdayarr.updateOne({ _id: o_id }, { $pull: { slots: req.slotTimeActual } })
                        .then(data => {
                            // console.log(data, 'data++')

                            req.dob = moment(req.dob).add(1, 'day').format("MM/DD/YYYY");
                            req = Object.assign(req, {
                                status: 0,
                                startdate_unix: moment(req.startdate, "MM/DD/YYYY").valueOf(),
                                booking_time_unix: moment().valueOf(),
                                is_google_event: true
                            });

                            // console.log(req, 'req==')

                            google_events.create(req)
                                .then(resp => {
                                    console.log(resp, 'resp++')

                                    callback(null, {
                                        headers: headers,
                                        statusCode: 200,
                                        body: JSON.stringify({ "status": "success", "results": resp, event: event.data.id })
                                    })
                                })
                                .catch(err => {
                                    console.log(err, 'err for google_events ++===')
                                    callback(null, {
                                        headers: headers,
                                        statusCode: 200,
                                        body: JSON.stringify({ "status": "error", "results": err, })
                                    })
                                })

                        })
                        .catch(err => {
                            console.log(err, 'err for eventdayarr ++====')
                            callback(null, {
                                headers: headers,
                                statusCode: 200,
                                body: JSON.stringify({ "status": "error", "results": err, })
                            })
                        })
                })
        }

    });
}


//update event into google calendar
function updateEvents(auth, req, callback) {
    let calendar = google.calendar({ version: 'v3', auth });
    var event = {
        'summary': req.event_title,
        'location': req.timezoneName,
        'description': req.description,
        'start': {
            'dateTime': req.startDateTime,
            'timeZone': req.timezone,
        },
        'end': {
            'dateTime': req.endDateTime,
            'timeZone': req.timezone,
        },
    };

    console.log('Event  edit ');

    calendar.events.update({
        resource: event,
        auth: auth,
        calendarId: 'primary',
        eventId: req.googleevent,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event update: %s', event.htmlLink);

        callback(null, {
            headers: headers,
            statusCode: 200,
            body: JSON.stringify({ "status": "success", "results": event, })
        })
    });
}



//delete event from google calendar
function deleteEvents(auth, req, callback) {
    let calendar = google.calendar({ version: 'v3', auth });

    console.log('Event  delete ');

    var o_id = mongoose.Types.ObjectId(req._id);
    var eid = mongoose.Types.ObjectId(req.eid);

    connectToDatabase()
        .then(() => {
            google_events.updateOne({ _id: o_id }, { $set: { status: 2 } }, function (err, data) {
                console.log(data, 'data+++')
                if (!err) {
                    eventdayarr.updateOne({ _id: eid }, { $pull: { slots: req.slotTimeActual } }, function (err, res) {
                        if (!err) {
                            console.log(res, 'res+++')

                            calendar.events.delete({
                                auth: auth,
                                calendarId: 'primary',
                                eventId: req.googleevent,
                            }, function (err, event) {
                                if (err) {
                                    console.log('There was an error contacting the Calendar service: ' + err);
                                    return;
                                }
                                console.log('Event delete: %s', event.htmlLink);

                                callback(null, {
                                    headers: headers,
                                    statusCode: 200,
                                    body: JSON.stringify({ "status": "success", "results": event, })
                                })
                            });
                        } else {
                            callback(null, {
                                headers: headers,
                                statusCode: 200,
                                body: JSON.stringify({ "status": "error", "results": err, })
                            })
                        }
                    })
                } else {
                    callback(null, {
                        headers: headers,
                        statusCode: 200,
                        body: JSON.stringify({ "status": "error", "results": err, })
                    })
                }
            })
        })
}



function test(event, context, callback) {
    console.log('test hit', event)
    if (process.env.NODE_ENV == 'dev') {
        databaseName = "db_pece";
        // sourceName = "PECE<support@dev.peceportal.com>";
        // Url = "https://dev.peceportal.com/";
        // LoginUrl = "https://dev.peceportal.com/";
    } else {
        databaseName = "db_pece_live";
        // sourceName = "PECE<support@peceportal.com>";
        // Url = "https://peceportal.com/";
        // LoginUrl = "https://peceportal.com/";

    }
    console.log('test hit', databaseName)

}
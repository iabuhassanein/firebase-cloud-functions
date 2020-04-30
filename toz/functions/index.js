const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {sendToMobile} = require('./Services/CloudMessaging');
const {sendToRealtimeDatabase} = require('./Services/WebNotification');
let admin = require('firebase-admin');
// admin.initializeApp();
admin.initializeApp(functions.config().firebase);
const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    const hash = req.body.hash;
    if(hash !== 'dd266fb2262537be14074bc19417fc2a8a33d98e5713da8ae74b428159d17bc2') return res.sendStatus(403);
    next();
});

app.post('/notify-mobile', (req, res) => {
    let _body = req.body;
    return  sendToMobile(_body.fcm, _body.data).then((result) => {
        return res.send({status: true, result: result});
    }).catch((error) => {
        return res.send({status: false, result: error});
    })
});

app.post('/notify-database', (req, res) => {
    let _body = req.body;
    return sendToRealtimeDatabase(_body.topic, _body.data).then((result) => {
        return res.send({status: true, result: result});
    }).catch((error) => {
        return res.send({status: false, result: error});
    })
});

app.post('/get-notifications', (req, res) => {
    let _body = req.body;
    return res.send({status: true, result: []});
});

exports.service = functions.https.onRequest(app);

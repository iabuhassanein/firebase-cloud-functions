const functions = require('firebase-functions');

let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

function sendPushNotification(_owner_id, _order, _is_for_delegate){
    
    return admin.firestore().collection('Accounts').doc(String(_owner_id)).get().then(doc => {
        var _account = doc.data();
        var _title = 'لديك رسالة جديدة';
        if(_account.lang === 'en') _title = 'You have new Message';
        var _msg = 'لديك رسالة جديدة في الطلب: ' + _order;
        if(_account.lang === 'en') _msg = 'You have new Message on order: ' + _order;
        var _status = _is_for_delegate?'1':'0';
        var payload = {
            data: {
                title: _title,
                body: _msg,
                notification_type: 'new_message',
                is_for_delegate: _status,
                order_id: _order,
            },
            notification: {
                title: _title,
                body: _msg,
                sound: 'default'
            }
        };
        // console.log(payload);
        // return 1;
        return admin.messaging().sendToDevice(_account.fcm, payload, {contentAvailable: true})
        .then(function (response) {
            // console.log("Successfully sent message:", response);
            return response;
        })
        .catch(function (error) {
            // console.log("Error sending message:", error);
            return error;
        });
    }).catch(error => {
        return error;
    });
}

exports.checkNewMessage = functions.firestore.document('Orders/{orderID}/Offers/{offerID}/Messages/{msg}').onCreate((snap, context) => {
    var _message = snap.data();
    var _context = context;
     return admin.firestore().collection('Orders').doc(_context.params.orderID).get().then(doc => {
        var _order = doc.data();
        var _account_id = 0;
        var _is_for_delegate = false;
        // console.log(_order, _message);
        
        if(_order.owner_id !== _message.owner_id){
            _account_id = _order.owner_id;
            _is_for_delegate = false;
            // console.log('account id: ' + _account_id);
            // return 1;
            return sendPushNotification(_account_id, context.params.orderID, _is_for_delegate);
        }else{
            _is_for_delegate = true;
            // eslint-disable-next-line promise/no-nesting
            return admin.firestore().collection('Orders').doc(_context.params.orderID).collection('Offers').doc(_context.params.offerID).get().then(of_doc => {
                var _offer = of_doc.data();
                _account_id = _offer.owner_id;
                // console.log( _offer);
                // console.log('offer account id: ' + _account_id);
                // console.log(context.params.orderID);
                // return sendPushNotification(_offer.owner_id, context.params.orderID);
                return sendPushNotification(_account_id, _context.params.orderID, _is_for_delegate);
            }).catch(error => {
                return error;
            });
        }
    }).catch(error => {
        return error;
    });

    // return 1;
});

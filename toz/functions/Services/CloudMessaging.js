let admin = require('firebase-admin');
module.exports = {
    sendToMobile(_fcm, _data){
        let payload = {
            data: _data,
            notification: {
                title: _data.title,
                body: _data.message,
                sound: 'default'
            }
        };
        return admin.messaging().sendToDevice(_fcm, payload, {contentAvailable: true})
            .then(function (response) {
                console.log("Successfully sent message:", response);
                return response;
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
                return error;
            });
    },

    async implicitSendToMobile(_fcm, _data){
        let payload = {
            data: _data,
            notification: {
                title: _data.title,
                body: _data.message,
                sound: 'default'
            }
        };
        return await admin.messaging().sendToDevice(_fcm, payload, {contentAvailable: true});
    }
}

const functions = require('firebase-functions');

let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/messages/{conversationId}/{messageId}').onCreate((event, context) => {
    const conversationId = context.params.conversationId;
    const messageId = context.params.messageId;
    const message = event.val();
    const conversationPath = (conversationId.includes("_")) ? 'messagingChats' : 'trainingChats';
    return admin.database().ref("/" + conversationPath + "/" + conversationId).once('value').then(snap => {
        const conversation = snap.val();
        var notifiedID = (message.senderID === conversation.teacherID) ? conversation.studentID : conversation.teacherID;
        //get the token of the user receiving the message
        return admin.database().ref("/users/" + notifiedID).once('value').then(userSnap => {
            const user = userSnap.val();
            const payload = {
                data: {
                    data_type: conversationPath,
                    title: "New Message  " + user.fullName,
                    body: message.content,
                    message: message.content,
                    // messageID: messageId,
                },
                notification: {
                    data_type: conversationPath,
                    title: "New Message  " + user.fullName,
                    body: message.content,
                    message: message.content,
                    // messageID: messageId,
                }

        };
            let isOpened = (message.senderID === conversation.teacherID) ? conversation.isOpenedByStudent : conversation.isOpenedByTeacher;
            if (isOpened !== undefined && parseInt(isOpened) === 0) {
                return admin.messaging().sendToDevice(user.fcmToken, payload)
                    .then(function (response) {
                        console.log("Successfully sent message:", response);
                        return response;
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                        return error;
                    });
            } else {
                console.log("opened conversation");
                return snap;
            }
        });
    });
});
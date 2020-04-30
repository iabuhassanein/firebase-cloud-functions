const functions = require('firebase-functions');

let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.updateNewTeacherStatus = functions.database.ref('/status/{teacherID}').onCreate((event, context) => {
    const teacherID = context.params.teacherID;
    const _status = event.val();
    var _newStatus = 0;
    if(_status.state === 'online'){
        _newStatus = 2;
    }else if(_status.state === 'busy'){
        _newStatus = 1;
    }

    return admin.firestore().collection('Teachers').doc(teacherID).set({
        online: _newStatus,
        last_online: _status.last_changed
    }, {merge: true});
});

exports.updateTeacherStatus = functions.database.ref('/status/{teacherID}').onUpdate((event, context) => {
    const teacherID = context.params.teacherID;
    const _status = event.after.val();
    var _newStatus = 0;
    if(_status.state === 'online'){
        _newStatus = 2;
    }else if(_status.state === 'busy'){
        _newStatus = 1;
    }

    return admin.firestore().collection('Teachers').doc(teacherID).set({
        online: _newStatus,
        last_online: _status.last_changed
    }, {merge: true});
});
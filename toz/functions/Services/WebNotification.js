let admin = require('firebase-admin');
module.exports = {
    sendToRealtimeDatabase(_topic, _data){
        let _reference = admin.firestore();
        if (_topic.type === 'account'){
            _reference = _reference.collection('Account-Notifications').doc(String(_topic.uid));
            return _reference.get().then((doc) => {
                let _doc = doc.data();
                _reference.set({
                    account_id: _topic.uid,
                    unread: _doc.unread?_doc.unread+1:0
                }, {merge: true});
                return _reference.collection('Notifications').doc(String(new Date().getTime())).set(_data);
            }).catch(err => {
                return err;
            });
        }else if(_topic.type === 'topic'){
            // storeNotificationToTopic(_topic.uid, _data);
        }
    }
}

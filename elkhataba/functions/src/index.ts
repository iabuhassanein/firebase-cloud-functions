// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// import request = require("request");

// exports.onlineStatusChange = functions.database.ref('/MembersOnlineStatusAndLastSeen/{id}').onUpdate(
//   event => {
//     const _val = event.after.val();
//     const _path = event.after.ref.path.toString();
//     const options = {
//         url: "https://elkhataba.com/api/v1"+_path+"/"+_val.is_online,
//         json: true
//      };
//      console.log(options.url);
//      return new Promise(function (resolve, reject) {
//         request(options, function (err, resp) {
//           resolve();
//         });
//      });
//     });

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.getMessagesCount = functions.https.onRequest((req, res) => {
  // Grab the text parameter.   res.send({status: false});
  const hash = req.query.hash;
  const _data = req.query.ids;
  if(hash != 't4PAT1B9RPFO5jgmmpSvnPhkrquzITGO') return res.sendStatus(403);
  var _input = JSON.parse(_data);

  const _final = [];
  function getFromDB(list){
    const curr = list.shift();
    return admin.firestore().collection('/Chats/'+curr+'/messages').once("value",(snapshot)=>{
      _final.push(snapshot.numChildren());
      if(list.length>0){
        return getFromDB(list);
      }else{
        return res.send({status: true, data:_final});
      }
    });
  }
  return getFromDB(_input);
});
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.getMessagesCount = functions.https.onRequest((req, res) => {
  // Grab the text parameter.   res.send({status: false});
  const hash = req.query.hash;
  const _points = req.query.points;
  const _ = req.query.points;
  if(hash != 't4PAT1B9RPFO5jgmmpSvnPhkrquzITGO') return res.sendStatus(403);
  var _input = JSON.parse(_data);

  const _final = [];
  function getFromDB(list: []){
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
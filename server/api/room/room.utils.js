/**
 * Created by prausa on 2/3/2017.
 */
import Room from "./room.model";
import * as util from '../../components/utils/utils';

var ObjectId = require('mongoose').Types.ObjectId;

//Save messages into particular room
export function saveMessages(roomID, messages, cb) {
  var query = {"roomID": roomID};
  var updation = {"$pushAll": {messages: messages}};
  var options = {new: true, upsert: false};
  Room.findOneAndUpdate(query, updation, options).exec()
    .then(room => {
      if (room)
        return cb(null, room);
      return cb('The room with id=', roomID, " is not found");
    })
    .catch(err => cb(err, null));
}

export function deleteMessage(roomID, messageID, deleteMessageForUsername, cb) {
  var query = {"_id": roomID, messageID: messageID};
  var updation = {"$pull": {"messages.$.to": deleteMessageForUsername}};
  var options = {new: true, upsert: false};
  Room.findOneAndUpdate(query, updation, options).exec()
    .then(room => {
      if (room)
        return cb(null, room);
      return cb('The room with id=', roomID, " is not found");
    })
    .catch(err => cb(err, null));
}

//Creates a new RoomID. Provide the ID of users as an array
export function generateRoomID(userIDs) {
  var roomID = '';

  function getCounterValue(id) {
    return parseInt(id.toString().substring(18, 24), 16);
  }

  var userObjects = userIDs.map(function (userID) {
    userID = new ObjectId(userID);
    return {
      id: userID,
      time: userID.getTimestamp() / (60000),
      counter: getCounterValue(userID)
    }
  });
  var sortedUsers = userObjects.sort(function (a, b) {
    var difference = a.time - b.time;
    if (difference === 0) {
      difference = a.counter - b.counter;
      difference = difference / Math.pow(10, difference.toString().length);
    }
    return difference;
  });
  sortedUsers.forEach(function (user, index) {
    roomID += user.counter.toString(36);
  });
  return roomID;
}

//Finds and returns the room based on roomID passed
export function find(roomID, cb){
  Room.findOne({roomID:roomID}).exec()
    .then(room =>{
        return cb(null, room);
    })
    .catch(err => cb(err, null));
}

export function getMessageCount(roomID, cb) {
  Room.findOne({roomID:roomID}).exec()
    .then(room =>{
      return cb(null, room.messages.length);
    })
    .catch(err => cb(err, null));
}

//Create Room in Rooms DB
export function createRoom(room, callback) {
  room = new Room(room);
  room.save()
    .then(room => {
        return callback(null, room);
    })
    .catch(err => callback(err, null));
}

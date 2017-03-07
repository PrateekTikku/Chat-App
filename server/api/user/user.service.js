/**
 * Created by prausa on 1/31/2017.
 */
import User from "./user.model";
import * as userUtils from "./user.utils";
var ObjectId = require('mongoose').Types.ObjectId;
var Q = require('q');
// Get the Contacts of particular user
export function getContacts(req, cb) {
  var userId = req.params.id;
  User.findOne({'_id': new ObjectId(userId)}, {contacts: 1, _id: 0}).exec()
    .then(user => {
      if (user)
        return cb(null, user.contacts);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}
//Add a new contact for the particular user
export function createContact(req, cb) {
  var userId = req.body.id;
  var contacts = {};
  contacts.contactID = new ObjectId(req.body.contactID);
  contacts.contactName = req.body.contactName;
  User.findOneAndUpdate({'_id': new ObjectId(userId)}, {$push: {'contacts': contacts}}, {
    new: true,
    upsert: false
  }).exec()
    .then(user=> {
      if (user)
        return cb(null, user);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}
//Delete contact/contacts for a particular user
export function deleteContact(req, cb) {
  var userId = req.body.id;
  var contactID = req.body.contactID;
  var query = {'_id': new ObjectId(userId)};
  var updation;
  if (Array.isArray(contactID)) {// If just one contact ID is passed, then remove that, else if an array of contact IDs is passed, remove all of them
    contactID = contactID.map(contact => new ObjectId(contact));
    updation = {"$pull": {"contacts": {"contactID": {"$in": contactID}}}};
  }
  else {
    contactID = new ObjectId(contactID);
    updation = {"$pull": {"contacts": {"contactID": contactID}}};
  }
  console.log(updation, Array.isArray(contactID), contactID);
  var options = {new: true, upsert: false};
  User.findOneAndUpdate(query, updation, options).exec()
    .then(user => {
      if (user)
        return cb(null, user);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}

//Get all the chats done by the user. Modify this function so that it brings out the room members other details such as picURL, name etc. Suggestion : Use mongoose 'populate' method
export function getRooms(req, cb) {
  var userId = req.params.id;
  User.findOne({'_id': new ObjectId(userId)}, {rooms: 1, _id: 0}).exec()
    .then(user => {
      if (user)
        return cb(null, user.rooms);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}
//Add a new room for the all the members of room
export function saveAsChat(members) {
  return function (room) {
    var defer = Q.defer();
    var user_room = {
      roomID: room.roomID,
      members: room.members
    };
    userUtils.addRooms(members, user_room, function (err, room) {
      if(err)
        defer.reject(err);
      defer.resolve(room);
    });
    return defer.promise;
  }
}
//Delete chat/chats for a particular User
export function deleteRoom(req, cb) {
  var userId = req.body.id;
  var roomID = req.body.roomID;
  var query = {'_id': new ObjectId(userId)};
  var updation = Array.isArray(roomID) ? {"$pull": {"rooms": {"roomID": {"$in": roomID}}}} : {"$pull": {"rooms": {"roomID": roomID}}}; // If just one room ID is passed, then remove that, else if an array of room IDs is passed, remove all of them
  console.log(updation, Array.isArray(roomID), roomID);
  var options = {new: true, upsert: false};
  User.findOneAndUpdate(query, updation, options).exec()
    .then(user => {
      if (user)
        return cb(null, user);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}

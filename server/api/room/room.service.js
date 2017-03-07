/**
 * Created by prausa on 2/20/2017.
 */
import * as roomUtil from "./room.utils";
import * as util from "../../components/utils/utils";
var Q = require('q');

//An object containing all the active chats
var roomContainer = {};

//Join the existing in-memory room
export function joinCurrentRoom(socket, roomID, userID) {
  var socketID = socket.id.substring(6, socket.id.length);
  var defer = Q.defer();
  socket.join(roomID);
  roomContainer[roomID].memberCount++;
  // if (roomContainer[roomID].map[socketID])
  //   defer.reject(new Error('Duplicate userIDs for the same socket'));
  roomContainer[roomID].map[socketID] = userID;
  defer.resolve(roomID);
  return defer.promise;
}

//Bring room from db.rooms collection and join it
export function continueOldChat(socket, roomID) {
  var defer = Q.defer();
  roomUtil.find(roomID, function (err, room) { //Since the socket in not already present in memory, bring the room members from the DB
    if (err)
      return defer.reject(err);
    if (room == null)
      return defer.reject("No room with this roomID is found");
    socket.join(roomID);
    defer.resolve(room);
  });
  return defer.promise;
}

//Create a new room and join it
export function joinNewRoom(socket, roomID) {
  var defer = Q.defer();
  socket.join(roomID);
  defer.resolve(roomID);
  return defer.promise;
}

//Checks if room with this room ID is currently active
export function isCurrentlyActive(roomID) {
  return roomContainer.hasOwnProperty(roomID);
}

//Checks if this room was created at any point in time
export function hasChattedBefore(roomID) {
  var defer = Q.defer();
  roomUtil.find(roomID, function (err, room) {
    if (err)
      defer.reject(err);
    defer.resolve(room);
  });
  return defer.promise;
}

//save room in db.rooms collection
export function saveRoom(members) {
  return function (roomID) {
    var defer = Q.defer();
    members = util.toObjectIDs(members);
    var new_room = {
      messages: [],
      members: members,
      roomID: roomID
    };
    roomUtil.createRoom(new_room, function (err, room) {
      if (err)
        defer.reject(err);
      return defer.resolve(room);
    });
    return defer.promise;
  }
}

//Configure the room and place it in room container which means this chat is currently active
export function placeRoomInContainer(socket, userID) {
  return function (room) {
    var defer = Q.defer();
    var socketID = util.getSocketID(socket);
    var socket_io_room;
    socket_io_room = socket.adapter.rooms[room.roomID];   //Get the reference of room the socket has joined
    socket_io_room.messages = [];
    socket_io_room.bufferMessages = [];
    socket_io_room.isWriting = false;
    socket_io_room.memberCount = 1;
    socket_io_room.members = room.members;
    socket_io_room.map = {};
    socket_io_room.map[socketID] = userID;
    roomUtil.getMessageCount(room.roomID, function (err, count) {
      if (err)
        defer.reject(new Error(err));
      socket_io_room.messageCount = count;
      roomContainer[room.roomID] = socket_io_room;
      defer.resolve(room.roomID);
    });
    return defer.promise;
  }
}

//Returns the userID corresponding to the socketID i.e the user which is connected throught the socket
export function toUserID(roomID, socketID) {
  return roomContainer[roomID].map[socketID];
}

export function addMessage(roomID, sender, message) {
  var socket_room = roomContainer[roomID];
  var messageObject = {
    messageID: ++socket_room.messageCount,
    sender: sender,
    message: message,
    receivers: [socket_room.members]
  };
  if (socket_room.messages.length >= 2) {
    socket_room.bufferMessages.push(messageObject);
    if (!socket_room.isWriting) {
      socket_room.isWriting = true;
      roomUtil.saveMessages(roomID, socket_room.messages, function (err, room) {
        if (err)
          return console.log(err);
        socket_room.isWriting = false;
        socket_room.messages = socket_room.bufferMessages.slice(0);
        socket_room.bufferMessages = [];
      });
    }
  }
  else {
    socket_room.messages.push(messageObject);
  }
}


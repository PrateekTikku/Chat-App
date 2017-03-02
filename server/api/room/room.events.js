import * as roomUtil from "./room.utils";
import * as util from "../../components/utils/utils";
import * as roomService from "./room.service";
import * as userService from "../user/user.service";


//If user is opening an existing room, then provide the roomID as a string, else provide the ids of the members in an array
export function join(data, callback) {
  var roomID, members, type;
  var socket = this;

  if (Array.isArray(data))                                  //data : Client is expected to either send roomID as string or an an array of members of room
    type = 'Create new chat';
  else if (typeof data === 'string')
    type = 'Has chatted before';
  else
    type = 'Room ID sent is wrong';

  switch (type) {
    case 'Has chatted before':                                 //User is opening a chat which probably he/she has done previously
      roomID = data;
      if (roomService.isCurrentlyActive(roomID)) {            //Check if the room is already present in the memory
        joinCurrentRoom(socket, roomID);
      }
      else {                                                  //The room is not present in memory
        roomService.hasChattedBefore(roomID)
          .then(function (yes) {
          if (yes) {                                            //Check if the user has done this chat before
            continueOldChat(socket, roomID);
          }
          else {                                               //The room ID provided by the user is not correct
            console.log('room.events.js : join function: RoomID provided does not exist');
            callback('RoomID: +' + roomID + ' provided does not exist');
          }
        });
      }
      break;
    case 'Create new chat':                                 //User has sent an Array of members which means user does not have this chat showing up in his chats
      members = data;
      members = util.toObjectIDs(members);
      roomID = roomUtil.generateRoomID(members);

      if (roomService.isCurrentlyActive(roomID)) {            //Check if the room is already present in the memory
        joinCurrentRoom(socket, roomID);
      }
      else {
        roomService.hasChattedBefore(roomID).then(function (yes) {
          if (yes) {                                              //Check if the user has done this chat before
            continueOldChat(socket, roomID);
          }
          else {                                                 //User has never done this chat before
            joinNewRoom(socket, roomID);
          }
        });
      }
      break;
    case 'default':                                         //User ID sent to server is not in correct format
      callback(type || 'Something went wrong');
      break;
  }

  function joinCurrentRoom(socket, roomID) {
    roomService.joinCurrentRoom(socket, roomID)           //Since the room is present, hence join it
        .then(function (roomID) {
        console.log('Joined Active Room-', roomID);
        callback(roomID);                                 //Tell the client that room has been joined, and return the room ID
      })
      .catch(function (err) {
        console.log(err);
        callback(err);
      });
  }

  function continueOldChat(socket, roomID) {
    roomService.continueOldChat(socket, roomID)       //Since the chat was done in past, bring the room from db.rooms and join it
      .then(roomService.placeRoomInContainer(socket)) //Place the room joined in room container i.e. in memory
      .then(function (room) {
        console.log('Joined Existing Room From DB-', room.roomID);
        callback(room);                               //Tell the client that room has been joined, and return the room object
      })
      .catch(function (err) {
        console.log(err);
        callback(err);
      });
  }

  function joinNewRoom(socket, roomID) {
    roomService.joinNewRoom(socket, roomID)             //Create a new room and join it
      .then(roomService.saveRoom(members))              //Save the room in db.rooms collection
      .then(userService.saveAsChat(members))            //Save the room in each user's document who is a part of this room i.e. save in db.users collection
      .then(roomService.placeRoomInContainer(socket))   //Place the room joined in room container i.e. in memory
      .then(emitUpdateChats(socket))                    //Ask all the members of that room to update their chats section
      .then(function (room) {
        console.log('Joined a newly created room-', room.roomID);
        callback(room);                                 //Tell the client that room has been joined, and return the room object
      })
      .catch(function (err) {
        console.log(err);
        callback(err);
      });
  }

}

//Inform all the members of the room to update their chats section
function emitUpdateChats(socket) {
  return function (room) {
    socket.broadcast.to(room.roomID).emit('Update Chats', room);
    return room;
  }
}

//Provide following fields in data object - 'roomID', 'from', 'message'
export function send(data) {
  var socket = this;
  var roomID = data.roomID;
  var room = socket.adapter.rooms[roomID];
  socket.broadcast.to(roomID).emit('Incoming Message', data); //Broadcast this message to others in the room
  //addMessage(room, data);
}

//Add this message to the room messages array
function addMessage(room, data) {
  var from = data.from;
  var message = {
    message: data.message,
    to: room.members,
    from: from
  };
  room.messages.push(message);
  if (room.messages.length === 20) {
    //Continue from here
    //Save to DB
  }
}


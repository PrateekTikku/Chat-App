'use strict';

import * as events from './room.events';
var rooms = {};

// Events to listen for and their listeners
var listeners = {
  'join': events.join, //Emit this event when first message is sent by the user
  'send': events.send
};

export function register(socket) {
  var key;
  for (key in listeners) {
    if (listeners.hasOwnProperty(key)) {
      var event = key;
      socket.on(event, listeners[event]);
      socket.on('disconnect', removeListener(socket, event, listeners[event]));
    }
  }
  socket.on('disconnect', disconnect);
}

function disconnect() {
  var socket = this;
  socket.log('DISCONNECTED');
  socket.emit('disconnected');
  //Do Stuff
}

function removeListener(socket, event, listener) {
  return function () {
    socket.removeListener(event, listener);
  };
}


'use strict';

import mongoose from "mongoose";

var RoomSchema = new mongoose.Schema({
  roomID: {type: String, unique: true, index: true},
  members: [],
  messages: [{
    _id: false,
    messageID: {type: Number},
    message: String,
    time: {type: Date, default: Date.now},
    receivers: [],
    sender: String
  }]
});

export default mongoose.model('Room', RoomSchema);

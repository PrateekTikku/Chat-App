'use strict';

import mongoose from "mongoose";

var RoomSchema = new mongoose.Schema({
  roomID: {type: String, unique: true, index: true},
  members: [],
  messages: [{
    _id: false,
    messageID: {type: Number, auto: true},
    message: String,
    time: {type: Date, default: Date.now},
    to: [],
    from: String
  }]
});

export default mongoose.model('Room', RoomSchema);

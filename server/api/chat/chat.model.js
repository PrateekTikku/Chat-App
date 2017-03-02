'use strict';

import mongoose from 'mongoose';

var ChatSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Chat', ChatSchema);

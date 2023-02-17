const mongoose = require('mongoose');

const ChatChatSchema = mongoose.Schema({
  encrypted_id: { type: String, ref: 'ChatVideos', require: true },
  time: {
    type: Number,
    require: true,
    trim: true,
    default: 36000000
  },
  text: {
    type: String,
    require: true,
    trim: true,
    default: "sayHo!"
  },
  key: {
    type: String,
    require: false,
    trim: true,
  },
  fontFamily: {
    type: String,
    require: false,
    trim: true
  },
  fontSize: {
    type: String,
    require: false,
    trim: true
  },
  color: {
    type: String,
    require: false,
    trim: true
  },
  avatar: {
    type: String,
    require: false,
    trim: true
  }
}, { timestamps: true })

module.exports = mongoose.model('ChatChats', ChatChatSchema)
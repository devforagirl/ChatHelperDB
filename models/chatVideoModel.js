const mongoose = require('mongoose');

const ChatVideoSchema = mongoose.Schema({
  encrypted_id: {
    type: String,
    require: true,
    default: "NoValueYet"
  }
}, { timestamps: true })

module.exports = mongoose.model('ChatVideos', ChatVideoSchema)
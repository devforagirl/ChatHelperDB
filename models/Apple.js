const mongoose = require('mongoose');

const appleSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true
  }
});

const Apple = mongoose.model('Apple', appleSchema);

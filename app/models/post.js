const mongoose = require('mongoose');

const postSchema  = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  authorNickname: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title required!']
  },
  body: {
    type: String,
    required: [true, 'Body required!']
  },
  image: {
    type: String,
    required: [true, 'Image required!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Post', postSchema)

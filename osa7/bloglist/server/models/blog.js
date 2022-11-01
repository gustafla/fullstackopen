const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  comment: { type: String },
})

commentSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title required'],
  },
  author: String,
  url: {
    type: String,
    required: [true, 'Blog url required'],
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [commentSchema],
})

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog

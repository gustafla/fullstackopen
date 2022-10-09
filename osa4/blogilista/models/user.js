const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username must be at least 3 characters'],
    required: [true, 'username is required'],
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
    delete returnedObject.blogs
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User

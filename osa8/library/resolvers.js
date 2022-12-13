const { UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    },
  },
  Book: {
    author: async (root) => Author.findById(root.author)
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, args) => {
      let find_args = {}

      // Find author's ID by name to use for Book find
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        find_args.author = author.id
      }

      if (args.genre) {
        find_args.genres = { $in: [args.genre] }
      }

      return Book.find(find_args)
    },
    allAuthors: async () => Author.find({}),
    me: (_root, _args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const session = await mongoose.startSession()

      // Transaction is used so that authors of invalid books don't end up in the DB
      session.startTransaction()
      try {
        let author = await Author.findOne({ name: args.author }).session(session)

        // Create author if unknown
        if (!author) {
          author = await new Author({ name: args.author }).save({ session })
        }

        // Create book
        const book = await new Book({ ...args, author }).save({ session })

        // Commit
        await session.commitTransaction()
        return book
      } catch (error) {
        await session.abortTransaction()

        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      } finally {
        session.endSession()
      }
    },
    editAuthor: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      try {
        author.born = args.setBornTo
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    createUser: async (_root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      try {
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('Incorrect username or password (hint: the password is "secret")')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

module.exports = resolvers

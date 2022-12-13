const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const pubSub = new PubSub()

const resolvers = {
  Author: {
    bookCount: async (root) => root.books.length,
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

      return Book.find(find_args).populate('author')
    },
    allAuthors: async () => Author.find({}).populate('books'),
    me: (_root, _args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      try {
        let author = await Author.findOne({ name: args.author })

        // Create author if unknown
        if (!author) {
          author = new Author({ name: args.author, books: [] })
          await author.validate()
        }

        // Create book
        const book = await new Book({ ...args, author }).save()

        // Add book to author
        author.books.push(book)
        await author.save()

        // Commit and publish to subscribers
        pubSub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers

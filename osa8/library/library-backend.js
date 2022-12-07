require('dotenv').config()
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI).then(() => {
  console.log('connected to mongodb')
}).catch((error) => {
  console.error('error connecting to mongodb:', error.message)
})

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

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

      // https://stackoverflow.com/questions/63507376/mongodb-mongoose-find-if-array-contains-includes
      if (args.genre) {
        find_args.$expr = { $in: [args.genre, '$genres'] }
      }

      return Book.find(find_args)
    },
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (_root, args) => {
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
    editAuthor: async (_root, args) => {
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
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

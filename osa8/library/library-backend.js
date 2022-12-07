require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
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
    bookCount: (root) => /*books.filter(b => b.author === root.name).length*/ 0,
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, args) => Book.find({}),
    //.filter(b => !args.author || b.author === args.author)
    //.filter(b => !args.genre || b.genres.find(g => g === args.genre)),
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (_root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = await new Author({ name: args.author }).save()
      }
      const book = new Book({ ...args, author })
      return book.save()
    },
    editAuthor: async (_root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
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

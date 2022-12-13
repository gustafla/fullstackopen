import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
fragment AuthorDetails on Author {
  id
  name
  born
  bookCount
}
`

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author {
    ...AuthorDetails
  }
  published
  genres
}
${AUTHOR_DETAILS}
`

export const ALL_AUTHORS = gql`
query allAuthors {
  allAuthors {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const FIND_BOOKS = gql`
query findBooks($genre: String) {
  allBooks(genre: $genre) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ALL_GENRES = gql`
query allGenres {
  allBooks {
    id
    genres
  }
}
`

//meme
export const ME = gql`
query me {
  me {
    id
    username
    favoriteGenre
  }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born) {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

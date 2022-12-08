import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query allAuthors {
  allAuthors {
    id
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query allBooks {
  allBooks {
    id
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    id
    title
    author {
      name
    }
    published
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born) {
    id
    name
    born
    bookCount
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

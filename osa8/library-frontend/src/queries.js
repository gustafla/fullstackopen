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

export const FIND_BOOKS = gql`
query findBooks($genre: String) {
  allBooks(genre: $genre) {
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

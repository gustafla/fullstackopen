import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, FIND_BOOKS, ALL_GENRES, ADD_BOOK } from '../queries'
import { updateBooksCache } from '../App'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.error(error)
      window.alert(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      const addBook = response.data.addBook
      for (const genre of [...addBook.genres, '']) {
        updateBooksCache(cache, { query: FIND_BOOKS, variables: { genre } }, addBook)
      }
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => ({
        allAuthors: allAuthors.find(a => a.id === addBook.author.id) ? allAuthors : allAuthors.concat(addBook.author)
      }))
      cache.updateQuery({ query: ALL_GENRES }, ({ allBooks }) => ({
        allBooks: allBooks.concat(addBook)
      }))
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title, author, published: Number(published), genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook

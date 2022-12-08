import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('')

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  // High algorithmic complexity, might get slow
  const genres = books.reduce((genres, book) => {
    for (const genre of book.genres) {
      genres.add(genre)
    }
    return genres
  }, new Set())
  // Better approach?: concat all genres, sort, and remove dupes
  // by a filter that compares current to next

  return (
    <div>
      <h2>books</h2>

      {filter ? <p>in genre <b>{filter}</b></p> : null}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter((b) => !filter || b.genres.includes(filter)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Filter by genre</h3>
      <select value={filter} onChange={({ target }) => setFilter(target.value)}>
        <option value=''>Show all</option>
        {
          [...genres].map((g) => <option key={g} value={g}>{g}</option>)
        }
      </select>
    </div>
  )
}

export default Books

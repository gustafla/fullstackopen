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

  const recommend = props.recommend

  return (
    <div>
      <h2>{recommend ? 'recommendations' : 'books'}</h2>

      {filter || recommend ? <p>
        books in {recommend ? <>your favorite genre <b>{recommend}</b></> : null /* books in recommend */}
        {filter && recommend ? <> and </> : null                                 /* and */}
        {filter ? <>genre <b>{filter}</b></> : null                              /* genre filter */}
      </p> : null}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => !recommend || b.genres.includes(recommend))
            .filter((b) => !filter || b.genres.includes(filter))
            .map((a) => (
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
          [...genres]
            .filter((g) => !recommend || g !== recommend) // Remove already recommend-filtered genre from options
            .map((g) => <option key={g} value={g}>{g}</option>)
        }
      </select>
    </div>
  )
}

export default Books

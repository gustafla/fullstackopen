import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FIND_BOOKS, ALL_GENRES } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const booksQuery = useQuery(FIND_BOOKS, {
    variables: { genre: filter }
  })
  const genresQuery = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (booksQuery.loading || genresQuery.loading) {
    return <div>Loading...</div>
  }

  const uniqueGenres = (allBooks) => {
    // Flatten and filter out duplicate genres
    let genres = allBooks.reduce((genres, book) => genres.concat(book.genres), [])
    genres.sort()
    return genres.filter((cur, i, arr) => (i + 1 >= arr.length) || cur !== arr[i + 1])
  }

  const books = booksQuery.data.allBooks
  const genres = uniqueGenres(genresQuery.data.allBooks)
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
          genres.filter((g) => !recommend || g !== recommend) // Remove already recommend-filtered genre from options
            .map((g) => <option key={g} value={g}>{g}</option>)
        }
      </select>
    </div>
  )
}

export default Books

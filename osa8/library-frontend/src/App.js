import { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { ME, BOOK_ADDED, FIND_BOOKS } from './queries'

export const updateBooksCache = (cache, query, addedBook) => {
  const uniqueById = (a) => {
    const sorted = [...a].sort((item_a, item_b) => item_a.id > item_b.id)
    return sorted.filter((val, i, arr) => i + 1 >= arr.length || val.id !== arr[i + 1].id)
  }

  cache.updateQuery(query, (data) => (data ? {
    allBooks: uniqueById(data.allBooks.concat(addedBook))
  } : undefined))
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const result = useQuery(ME, { skip: !token })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      window.alert(`New book ${book.title} by ${book.author.name} was added`)
      for (const genre of [...book.genres, '']) {
        updateBooksCache(client.cache, { query: FIND_BOOKS, variables: { genre } }, book)
      }
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('libraryUserToken')
    setToken(token)
  }, [])

  const logout = () => {
    localStorage.removeItem('libraryUserToken')
    setToken(null)
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <Books show={page === 'recommend'} recommend={result.data?.me.favoriteGenre} />

      <NewBook show={page === 'add'} />

      <LoginForm setToken={setToken} show={page === 'login'} />
    </div>
  )
}

export default App

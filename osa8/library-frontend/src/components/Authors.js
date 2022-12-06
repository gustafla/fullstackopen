import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const SetBirthyear = ({ authors, editAuthor }) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const submit = (event) => {
    event.preventDefault()

    const variables = { name: author, born: Number(born) }
    editAuthor({ variables })

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set Birthyear</h3>
      <form onSubmit={submit}>
        <select onChange={({ target }) => setAuthor(target.value)} value={author}>
          <option value='' disabled>Select author...</option>
          {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
        </select>
        <p>born <input type='number' value={born} onChange={({ target }) => setBorn(target.value)} /></p>
        <button type='submit' disabled={!author || !born}>update author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      window.alert(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthyear authors={authors} editAuthor={editAuthor} />
    </div>
  )
}

export default Authors

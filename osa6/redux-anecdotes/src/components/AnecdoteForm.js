import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    if (content) {
      event.target.content.value = ''
      const newAnecdote = await anecdoteService.createNew(content)
      dispatch(addAnecdote(newAnecdote))
      dispatch(setNotification(`You added '${content}'`))
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <div><input type='text' name='content' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => anecdotes.filter(a => a.content.includes(filter)))
  const dispatch = useDispatch()

  const vote = async (anecdote) => {
    const voted = { ...anecdote, votes: anecdote.votes + 1 }
    await anecdoteService.update(voted)
    dispatch(updateAnecdote(voted))
    dispatch(setNotification(`You voted '${anecdote.content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return (
    <div>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
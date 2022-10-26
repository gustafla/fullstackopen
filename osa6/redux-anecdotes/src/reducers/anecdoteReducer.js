import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { notify } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    updateAnecdote: (state, action) => {
      return state.map(a => a.id === action.payload.id ? action.payload : a)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  },
})

const { addAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
    dispatch(notify(`You added '${content}'`, 5))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const voted = { ...anecdote, votes: anecdote.votes + 1 }
    await anecdoteService.update(voted)
    dispatch(updateAnecdote(voted))
    dispatch(notify(`You voted '${anecdote.content}'`, 5))
  }
}

export default anecdoteSlice.reducer
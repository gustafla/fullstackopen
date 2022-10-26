import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

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
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const voted = { ...anecdote, votes: anecdote.votes + 1 }
    await anecdoteService.update(voted)
    dispatch(updateAnecdote(voted))
  }
}

export default anecdoteSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

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

export const { addAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
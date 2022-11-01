import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import handleException from './handleException'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (_state, action) => {
      return action.payload
    },
  },
})

const { setUsers } = userSlice.actions

export const initializeUsers = () => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    try {
      const users = await userService.getAll(token)
      dispatch(setUsers(users))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to fetch users')
    }
  }
}

export default userSlice.reducer

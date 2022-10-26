import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (_state, action) => {
      return action.payload
    },
  },
})

const { setNotification } = notificationSlice.actions

export const notify = (notification, seconds) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(setNotification('')), seconds * 1000)
  }
}

export default notificationSlice.reducer

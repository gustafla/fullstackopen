import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: '',
  timeout: null,
}

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

export const notify = (text, seconds) => {
  return async (dispatch, getState) => {
    clearTimeout(getState().notification.timeout)
    const timeout = setTimeout(() => dispatch(setNotification('')), seconds * 1000)
    dispatch(setNotification({ text, timeout }))
  }
}

export default notificationSlice.reducer

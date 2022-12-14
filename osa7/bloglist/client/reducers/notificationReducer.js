import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  success: {
    text: '',
    timeout: null,
  },
  error: {
    text: '',
    timeout: null,
  },
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.success = action.payload
    },
    clearSuccess: (state) => {
      state.success.text = ''
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error.text = ''
    },
  },
})

const { setSuccess, setError } = notificationSlice.actions
export const { clearSuccess, clearError } = notificationSlice.actions

export const notifySuccess = (text, seconds) => {
  return async (dispatch, getState) => {
    clearTimeout(getState().notification.success.timeout)
    const timeout = setTimeout(() => dispatch(clearSuccess()), seconds * 1000)
    dispatch(setSuccess({ text, timeout }))
  }
}

export const notifyError = (text, seconds) => {
  return async (dispatch, getState) => {
    clearTimeout(getState().notification.error.timeout)
    const timeout = setTimeout(() => dispatch(clearError()), seconds * 1000)
    dispatch(setError({ text, timeout }))
  }
}

export default notificationSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { notifySuccess, notifyError } from './notificationReducer'

const initialState = {}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (_state, action) => {
      return action.payload
    },
    clearSession: () => {
      return initialState
    },
  },
})

const { setSession, clearSession } = sessionSlice.actions

const sessionItem = 'loggedUser'

export const logOut = () => {
  return async (dispatch) => {
    window.localStorage.clear()
    dispatch(clearSession())
    dispatch(notifySuccess('Logged out', 5))
  }
}

const loginHelper = async (dispatch, session) => {
  window.localStorage.setItem(sessionItem, JSON.stringify(session))
  dispatch(setSession(session))
  dispatch(notifySuccess('Logged in', 5))
}

export const logIn = (username, password) => {
  return async (dispatch) => {
    try {
      const session = await loginService.login({ username, password })
      loginHelper(dispatch, session)
    } catch (exception) {
      const message = exception.response.data.error
      dispatch(notifyError(message ? message : 'Login service unavailable', 5))
    }
  }
}

export const loadSession = () => {
  return async (dispatch) => {
    const loggedUserJson = window.localStorage.getItem(sessionItem)
    if (loggedUserJson) {
      const session = JSON.parse(loggedUserJson)
      loginHelper(dispatch, session)
    }
  }
}

export default sessionSlice.reducer

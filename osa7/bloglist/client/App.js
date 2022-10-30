import React, { useState, useEffect, useCallback } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { notifySuccess } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const sessionItem = 'loggedUser'

const App = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)

  // Removes all user login state from the application
  const logUserOut = useCallback(() => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.clear()
    dispatch(notifySuccess('Logged out', 5))
  }, [dispatch])

  // Helper that sets all login state
  const logUserIn = useCallback(
    (user) => {
      window.localStorage.setItem(sessionItem, JSON.stringify(user))
      blogService.setToken(user.token)
      blogService.setExpiredHandler(logUserOut)
      setUser(user)
      dispatch(notifySuccess('Logged in', 5))
    },
    [logUserOut, dispatch],
  )

  // Load session from localstorage
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem(sessionItem)
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      logUserIn(user)
    }
  }, [logUserIn])

  return (
    <div>
      <Notification className={'success'} />
      <Notification className={'error'} />
      {user ? (
        <div>
          {user.name ? user.name : user.username} logged in
          <button type='button' onClick={logUserOut}>
            logout
          </button>
          <Blogs user={user} />
        </div>
      ) : (
        // Render login when not logged in
        <Login logUserIn={logUserIn} />
      )}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'

const sessionItem = 'loggedUser'

const App = () => {
  const [user, setUser] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  // Helper that sets all login state except for localstorage
  const logUserIn = user => {
    window.localStorage.setItem(sessionItem, JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
  }

  // Removes all user login state from the application
  const logUserOut = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.clear()
    setSuccess('Logged out')
  }

  // Load session from localstorage
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem(sessionItem)
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      logUserIn(user)
    }
  }, [])

  return (
    <div>
      <Notification className={'success'} message={success} setMessage={setSuccess} />
      <Notification className={'error'} message={error} setMessage={setError} />
      {user === null ?
        // Render login when not logged in
        <Login logUserIn={logUserIn} setError={setError} />
        : <div>
          {user.name ? user.name : user.username} logged in
          <button type='button' onClick={logUserOut}>logout</button>
          <Blogs setSuccess={setSuccess} setError={setError} />
        </div>
      }
    </div>
  )
}

export default App

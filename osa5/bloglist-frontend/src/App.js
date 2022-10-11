import { useState, useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const sessionItem = 'loggedUser'

const App = () => {
  const [user, setUser] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const notificationControl = { setSuccess, setError }

  // Removes all user login state from the application
  const logUserOut = () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.clear()
    notificationControl.setSuccess('Logged out')
  }

  // Helper that sets all login state
  const logUserIn = user => {
    window.localStorage.setItem(sessionItem, JSON.stringify(user))
    blogService.setToken(user.token)
    blogService.setExpiredHandler(logUserOut)
    setUser(user)
    notificationControl.setSuccess('Logged in')
  }

  // Load session from localstorage and setup notifications
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem(sessionItem)
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      logUserIn(user)
    }
    blogService.setNotificationControl(notificationControl)
    loginService.setNotificationControl(notificationControl)
  }, [])

  return (
    <div>
      <Notification className={'success'} message={success} setMessage={setSuccess} />
      <Notification className={'error'} message={error} setMessage={setError} />
      {user ?
        <div>
          {user.name ? user.name : user.username} logged in
          <button type='button' onClick={logUserOut}>logout</button>
          <Blogs user={user} />
        </div>
        // Render login when not logged in
        : <Login logUserIn={logUserIn} notificationControl={notificationControl} />
      }
    </div>
  )
}

export default App

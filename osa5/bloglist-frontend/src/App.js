import { useState, useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import blogService from './services/blogs'

const sessionItem = 'loggedUser'

const App = () => {
  const [user, setUser] = useState(null)

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
      {user === null ?
        // Render login when not logged in
        <Login logUserIn={logUserIn} />
        : <div>
          {user.name ? user.name : user.username} logged in
          <button type='button' onClick={logUserOut}>logout</button>
          <Blogs />
        </div>
      }
    </div>
  )
}

export default App

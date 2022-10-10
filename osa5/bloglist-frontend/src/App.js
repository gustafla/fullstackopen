import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (await handleLogin(username, password)) {
      setUsername('')
      setPassword('')
    } else {
      alert('Username or password incorrect')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

const Blogs = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    })()
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState(null)

  // Helper that sets all login state except for localstorage
  const logUserIn = user => {
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
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      logUserIn(user)
    }
  }, [])

  // Handles login component's attempts, saves to localstorage when successful
  const handleLogin = async (username, password) => {
    console.log('logging in', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      logUserIn(user)
      return true
    } catch (exception) {
      console.log('login failed', exception)
    }
    return false
  }

  // Render login when not logged in
  return (
    <div>
      {user === null ?
        <Login handleLogin={handleLogin} />
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

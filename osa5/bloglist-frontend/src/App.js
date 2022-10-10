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

const Blogs = ({ user, blogs }) => {
  return (
    <div>
      <p>{user.name ? user.name : user.username} logged in</p>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (user) {
      (async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      })()
    }
  }, [user])

  const handleLogin = async (username, password) => {
    console.log('logging in', username, password)
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch (exception) {
      console.log('login failed', exception)
    }
    return false
  }

  return (
    <div>
      {user === null ?
        <Login handleLogin={handleLogin} />
        : <Blogs user={user} blogs={blogs} />}
    </div>
  )

}

export default App

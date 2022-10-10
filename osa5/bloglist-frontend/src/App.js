import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const sessionItem = 'loggedUser'

const Login = ({ logUserIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Post login to backend
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('logging in', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(sessionItem, JSON.stringify(user))
      logUserIn(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('login failed', exception)
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

const CreateBlog = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Post blog to backend
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const blog = { title, author, url }
      const newBlog = await blogService.create(blog)
      addBlog(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.error('post failed', exception)
      alert(exception.response.data.error)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

const Blogs = () => {
  const [blogs, setBlogs] = useState([])

  // Load blog list from backend
  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    })()
  }, [])

  return (
    <div>
      <CreateBlog addBlog={blog => setBlogs(blogs.concat(blog))} />
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

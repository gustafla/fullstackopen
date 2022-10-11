import { useState, useEffect, useRef, forwardRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const CreateBlog = forwardRef(({ addBlog, notificationControl }, ref) => {
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
      notificationControl.setSuccess(`${title} by ${author} added!`)
      setTitle('')
      setAuthor('')
      setUrl('')
      ref && ref.current.toggleVisibility()
    } catch (exception) {
      console.error('post failed', exception)
      notificationControl.setError(exception.response.data.error)
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
})

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

const Blogs = ({ notificationControl }) => {
  const [blogs, setBlogs] = useState([])

  // Load blog list from backend
  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    })()
  }, [])

  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog addBlog={blog => setBlogs(blogs.concat(blog))} notificationControl={notificationControl} ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default Blogs
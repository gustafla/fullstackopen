import { useState, useEffect, useRef, forwardRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const CreateBlog = forwardRef(({ addBlog }, ref) => {
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
      ref && ref.current.toggleVisibility()
    } catch (exception) {
      console.error('post failed', exception)
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

const BlogDetails = ({ blog, handleLike }) => {
  return (
    <div>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button type='button' onClick={handleLike}>like</button></p>
      <p>{blog.user ? (blog.user.name ? blog.user.name : blog.user.nickname) : null}</p>
    </div>
  )
}

const Blog = ({ blog, handleLike }) => {
  const divStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showAll, setShowAll] = useState(false)

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  return (
    <div style={divStyle} onClick={toggleShow}>
      <b>{blog.title}</b> by {blog.author}
      {showAll ? <BlogDetails blog={blog} handleLike={handleLike} /> : null}
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

  const handleLike = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const newBlog = await blogService.update(likedBlog)
      setBlogs(blogs.map(b => b.id === newBlog.id ? newBlog : b))
    } catch (exception) {
      console.log('like failed', exception)
    }
  }


  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog addBlog={blog => setBlogs(blogs.concat(blog))} ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} />
      )}
    </div>
  )
}

export default Blogs
import { useState, useEffect, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import PropTypes from 'prop-types'
import CreateBlog from './CreateBlog'
import Blog from './Blog'

const Blogs = ({ user }) => {
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
      console.error('like failed', exception)
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        console.error('remove failed', exception)
      }
    }
  }

  const addBlog = async (blog) => {
    const newBlog = await blogService.create(blog)
    setBlogs(blogs.concat(newBlog))
  }

  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateBlog
          addBlog={addBlog}
          ref={blogFormRef}
        />
      </Togglable>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog)}
          handleRemove={() => handleRemove(blog)}
          user={user}
        />
      )}
    </div>
  )
}

Blogs.propTypes = {
  user: PropTypes.object.isRequired,
}

export default Blogs
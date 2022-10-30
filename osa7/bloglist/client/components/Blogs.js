import React, { useState, useEffect, useRef } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import PropTypes from 'prop-types'
import CreateBlog from './CreateBlog'
import Blog from './Blog'
import { notifySuccess, notifyError } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const Blogs = ({ user }) => {
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([])

  // Load blog list from backend
  useEffect(() => {
    ;(async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    })()
  }, [])

  const handleLike = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const newBlog = await blogService.update(likedBlog)
      setBlogs(blogs.map((b) => (b.id === newBlog.id ? newBlog : b)))
      dispatch(notifySuccess(`Liked ${blog.title}!`, 5))
    } catch (exception) {
      console.error('like failed', exception)
      const message = exception.response.data.error
      dispatch(notifyError(message ? message : 'Failed to like', 5))
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        dispatch(notifySuccess(`Removed ${blog.title}!`, 5))
      } catch (exception) {
        console.error('remove failed', exception)
        const message = exception.response.data.error
        dispatch(notifyError(message ? message : 'Failed to remove', 5))
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
        <CreateBlog addBlog={addBlog} ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => handleLike(blog)}
            handleRemove={() => handleRemove(blog)}
            user={user}
          />
        ))}
    </div>
  )
}

Blogs.propTypes = {
  user: PropTypes.object.isRequired,
}

export default Blogs

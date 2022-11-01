import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, deleteBlog, likeBlog } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blogId }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blog = useSelector(({ blogs }) => blogs.find((b) => b.id === blogId))
  const sessionUsername = useSelector(({ session }) => session.user.username)

  // Fetch blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  if (!blog) {
    return null
  }

  const handleLikeButton = () => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      navigate('/blogs')
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>

      <a href={blog.url}>{blog.url}</a>

      <div>
        {blog.likes} likes
        <button onClick={handleLikeButton}>like</button>
      </div>

      {blog.user ? (
        <p>Added by {blog.user.name ? blog.user.name : blog.user.username}</p>
      ) : null}

      {
        // Render remove-button only for blogs which don't have username,
        // or which have been posted by session owner
        !blog.user || blog.user.username === sessionUsername ? (
          <button
            type='button'
            onClick={handleRemove}
            className='blogRemoveButton'
          >
            remove
          </button>
        ) : null
      }
    </div>
  )
}

Blog.propTypes = {
  blogId: PropTypes.string,
}

export default Blog

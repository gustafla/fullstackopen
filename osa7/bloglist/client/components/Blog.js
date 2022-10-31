import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, likeBlog } from '../reducers/blogsReducer'

const BlogDetails = ({ blog }) => {
  const dispatch = useDispatch()
  const sessionUsername = useSelector(({ session }) => session.username)

  const handleLikeButton = (event) => {
    // Stop like-click from propagating to the blog div
    // so it doesn't collapse itself
    event.stopPropagation()
    dispatch(likeBlog(blog))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <div className='blogDetails'>
      <p>{blog.url}</p>
      <p>
        likes {blog.likes}
        <button
          type='button'
          onClick={handleLikeButton}
          className='blogLikeButton'
        >
          like
        </button>
      </p>

      {
        /* Render blog's poster's name if available or username if available */
        blog.user ? (
          <p>{blog.user.name ? blog.user.name : blog.user.username}</p>
        ) : null
      }

      {
        /* Render remove-button only for blogs which don't have username,
         or which have been posted by session owner */
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

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
}

const Blog = ({ blog }) => {
  const divStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showAll, setShowAll] = useState(false)

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  return (
    <div style={divStyle} onClick={toggleShow} className='blog'>
      <p className='blogTitle'>
        <b>{blog.title}</b> by {blog.author}
      </p>
      {showAll ? <BlogDetails blog={blog} /> : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog

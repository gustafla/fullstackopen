import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { deleteBlog, likeBlog } from '../reducers/blogsReducer'

const BlogDetails = ({ blog, user }) => {
  const dispatch = useDispatch()

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
      {blog.user ? (
        <p>{blog.user.name ? blog.user.name : blog.user.username}</p>
      ) : null}
      {!blog.user || (user && blog.user.username === user.username) ? (
        <button
          type='button'
          onClick={handleRemove}
          className='blogRemoveButton'
        >
          remove
        </button>
      ) : null}
    </div>
  )
}

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
}

const Blog = ({ blog, user }) => {
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
      {showAll ? <BlogDetails blog={blog} user={user} /> : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
}

export default Blog

import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogDetails = ({ blog, handleLike, handleRemove, user }) => {
  const handleLikeButton = (event) => {
    // Stop like-click from propagating to the blog div
    // so it doesn't collapse itself
    event.stopPropagation()
    handleLike()
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
      {blog.user ?
        <p>{blog.user.name ? blog.user.name : blog.user.username}</p>
        : null}
      {(!blog.user || (user && blog.user.username === user.username)) ?
        <button
          type='button'
          onClick={handleRemove}
          className='blogRemoveButton'
        >
          remove
        </button>
        : null}
    </div>
  )
}

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.object,
}

const Blog = ({ blog, handleLike, handleRemove, user }) => {
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
      <p className='blogTitle'><b>{blog.title}</b> by {blog.author}</p>
      {showAll ?
        <BlogDetails
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          user={user}
        /> : null}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.object,
}

export default Blog

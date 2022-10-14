import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogDetails = ({ blog, handleLike, handleRemove, user }) => {
  return (
    <div>
      <p>{blog.url}</p>
      <p>
        likes {blog.likes}
        <button type='button' onClick={handleLike}>like</button>
      </p>
      {blog.user ?
        <p>{blog.user.name ? blog.user.name : blog.user.username}</p>
        : null}
      {(!blog.user || blog.user.username === user.username) ?
        <button type='button' onClick={handleRemove}>remove</button>
        : null}
    </div>
  )
}

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

const Blog = ({ blog, handleLike, handleRemove, user }) => {
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
  user: PropTypes.object.isRequired,
}

export default Blog

import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, likeBlog, commentBlog } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'

const BlogComments = ({ blog }) => {
  const dispatch = useDispatch()

  const addComment = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog, event.target.comment.value))
    event.target.comment.value = ''
  }

  return (
    <div className='comments'>
      <h3>Comments</h3>
      <form onSubmit={addComment}>
        <table>
          <tbody>
            <tr>
              <td>
                <input type='text' name='comment' />
              </td>
              <td>
                <Button type='submit'>add comment</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {blog.comments.map((c) => (
        <Card key={c.id}>
          <Card.Body>{c.comment}</Card.Body>
        </Card>
      ))}
    </div>
  )
}

BlogComments.propTypes = {
  blog: PropTypes.object.isRequired,
}

const Blog = ({ blogId }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blog = useSelector(({ blogs }) => blogs.find((b) => b.id === blogId))
  const sessionUsername = useSelector(({ session }) => session.user.username)

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
      <h2>
        {blog.title}
        <div className='likes'>
          <div className='likesCount'>{blog.likes} likes</div>
          <Button size='sm' onClick={handleLikeButton}>
            like
          </Button>
        </div>
      </h2>

      <a href={blog.url} className='blogUrl'>
        {blog.url}
      </a>

      {blog.user ? (
        <p className='blogAddedBy'>
          Added by {blog.user.name ? blog.user.name : blog.user.username}
        </p>
      ) : null}

      {
        // Render remove-button only for blogs which don't have username,
        // or which have been posted by session owner
        !blog.user || blog.user.username === sessionUsername ? (
          <Button
            type='button'
            onClick={handleRemove}
            className='blogRemoveButton'
          >
            remove
          </Button>
        ) : null
      }

      <BlogComments blog={blog} />
    </div>
  )
}

Blog.propTypes = {
  blogId: PropTypes.string,
}

export default Blog

import React, { useEffect, useRef } from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'
import CreateBlog from './CreateBlog'
import Blog from './Blog'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../reducers/blogsReducer'

const Blogs = ({ user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => blogs)

  // Load blog list from backend
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch, user])

  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateBlog ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
    </div>
  )
}

Blogs.propTypes = {
  user: PropTypes.object.isRequired,
}

export default Blogs

import React, { useEffect, useRef } from 'react'
import Togglable from './Togglable'
import CreateBlog from './CreateBlog'
import Blog from './Blog'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../reducers/blogsReducer'

const Blogs = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => blogs)

  // Load blog list from backend
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

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
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

export default Blogs

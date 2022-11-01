import React, { useRef, useEffect } from 'react'
import Togglable from './Togglable'
import CreateBlog from './CreateBlog'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from '../reducers/blogsReducer'

const Blogs = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(({ blogs }) => blogs)

  // Fetch blogs
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  // Blog list item's style
  const divStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateBlog ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div key={blog.id} style={divStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            <p>{blog.likes} likes</p>
          </div>
        ))}
    </div>
  )
}

export default Blogs

import React, { useRef } from 'react'
import Togglable from './Togglable'
import CreateBlog from './CreateBlog'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'

const Blogs = () => {
  const blogs = useSelector(({ blogs }) => blogs)

  // Mediate access to Togglable's toggleVisibility from CreateBlog
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable
        buttonLabel='new blog'
        ref={blogFormRef}
        className='createBlog'
      >
        <CreateBlog ref={blogFormRef} />
      </Togglable>
      <h2>blogs</h2>
      <Table striped hover>
        <tbody>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td>{blog.likes} likes</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Blogs

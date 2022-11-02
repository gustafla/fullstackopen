import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = () => {
  const users = useSelector(({ users }) => users)

  return (
    <div>
      <h2>Users</h2>
      <Table striped hover>
        <thead>
          <tr>
            <th colSpan={2}>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {[...users]
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((u) => (
              <tr key={u.id}>
                <td>
                  <Link to={`/users/${u.id}`}>
                    {u.name ? u.name : u.username}
                  </Link>
                </td>
                <td>{u.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users

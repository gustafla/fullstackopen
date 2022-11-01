import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const User = ({ userId }) => {
  const user = useSelector(({ users }) => users?.find((u) => u.id === userId))

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name ? user.name : user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

User.propTypes = {
  userId: PropTypes.string,
}

export default User

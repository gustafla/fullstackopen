import React, { useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import PropTypes from 'prop-types'
import { Routes, Route, Navigate, Link, useMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logOut, loadSession } from './reducers/sessionReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'

const Notifications = () => {
  return (
    <div>
      <Notification className={'success'} />
      <Notification className={'error'} />
    </div>
  )
}

const Menu = ({ user }) => {
  const dispatch = useDispatch()

  const logUserOut = () => {
    dispatch(logOut())
  }

  const barStyle = {
    background: 'lightgrey',
    marginBottom: '30px',
  }

  const itemStyle = {
    margin: '4px',
    display: 'inline',
  }

  return (
    <div style={barStyle}>
      <Link to='/blogs' style={itemStyle}>
        blogs
      </Link>
      <Link to='/users' style={itemStyle}>
        users
      </Link>
      <p style={itemStyle}>{user.name ? user.name : user.username} logged in</p>
      <button type='button' onClick={logUserOut} style={itemStyle}>
        logout
      </button>
    </div>
  )
}

Menu.propTypes = {
  user: PropTypes.object,
}

const App = () => {
  const dispatch = useDispatch()
  const session = useSelector(({ session }) => session)

  // Match parameters in route
  const match = useMatch('/:res/:id')

  // Load session from localstorage
  useEffect(() => {
    dispatch(loadSession())
  }, [dispatch])

  // Initialize content when session becomes defined
  const user = session?.user
  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs())
      dispatch(initializeUsers())
    }
  }, [dispatch, user])

  // Early return when no session exists
  if (!user) {
    return (
      <div className='container'>
        <Notifications />
        <Login />
      </div>
    )
  }

  /* ---------------------------v- Logged in -v------------------------------ */

  return (
    <div className='container'>
      <Menu user={user} />
      <Notifications />
      <Routes>
        <Route path='/' element={<Navigate replace to='/blogs' />} />
        <Route path='/blogs/:id' element={<Blog blogId={match?.params.id} />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/users/:id' element={<User userId={match?.params.id} />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </div>
  )
}

export default App

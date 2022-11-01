import React, { useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Users from './components/Users'
import Notification from './components/Notification'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logOut, loadSession } from './reducers/sessionReducer'

const App = () => {
  const dispatch = useDispatch()
  const session = useSelector(({ session }) => session)

  const logUserOut = () => {
    dispatch(logOut())
  }

  // Load session from localstorage
  useEffect(() => {
    dispatch(loadSession())
  }, [dispatch])

  const user = session.user

  return (
    <div>
      <Notification className={'success'} />
      <Notification className={'error'} />

      {user ? (
        <div>
          {user.name ? user.name : user.username} logged in
          <button type='button' onClick={logUserOut}>
            logout
          </button>
          <Routes>
            <Route path='/' element={<Navigate replace to='/blogs' />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/users' element={<Users />} />
          </Routes>
        </div>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App

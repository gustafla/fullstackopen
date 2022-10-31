import React, { useEffect } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
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

  return (
    <div>
      <Notification className={'success'} />
      <Notification className={'error'} />
      {session.username ? (
        <div>
          {session.name ? session.name : session.username} logged in
          <button type='button' onClick={logUserOut}>
            logout
          </button>
          <Blogs />
        </div>
      ) : (
        // Render login when not logged in
        <Login />
      )}
    </div>
  )
}

export default App

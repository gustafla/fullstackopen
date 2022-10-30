import React, { useState } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'
import { notifyError } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const Login = ({ logUserIn }) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Post login to backend
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('logging in', username, password)
    try {
      const user = await loginService.login({ username, password })
      logUserIn(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('login failed', exception)
      const message = exception.response.data.error
      dispatch(notifyError(message ? message : 'Login service unavailable', 5))
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type='text'
            value={username}
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='loginButton'>
          login
        </button>
      </form>
    </div>
  )
}

Login.propTypes = {
  logUserIn: PropTypes.func.isRequired,
}

export default Login

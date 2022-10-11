import { useState } from 'react'
import loginService from '../services/login'

const Login = ({ logUserIn }) => {
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
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login

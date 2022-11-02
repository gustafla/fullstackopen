import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logIn } from '../reducers/sessionReducer'
import { Button } from 'react-bootstrap'

const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(logIn(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>username</td>
              <td>
                <input
                  type='text'
                  value={username}
                  id='username'
                  onChange={({ target }) => setUsername(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>password</td>
              <td>
                <input
                  type='password'
                  value={password}
                  id='password'
                  onChange={({ target }) => setPassword(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Button type='submit' id='loginButton'>
                  login
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default Login

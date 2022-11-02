import React, { useState, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogsReducer'
import { Button, ButtonGroup } from 'react-bootstrap'

const CreateBlog = forwardRef((_, ref) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const hide = () => {
    ref && ref.current.toggleVisibility()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    dispatch(createBlog(blog))
    hide()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>title</td>
              <td>
                <input
                  type='text'
                  value={title}
                  name='title'
                  className='blogTitleInput'
                  onChange={({ target }) => setTitle(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>author</td>
              <td>
                <input
                  type='text'
                  value={author}
                  name='author'
                  className='blogAuthorInput'
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>url</td>
              <td>
                <input
                  type='text'
                  value={url}
                  name='url'
                  className='blogUrlInput'
                  onChange={({ target }) => setUrl(target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <ButtonGroup>
          <Button type='submit' className='blogCreateButton'>
            create
          </Button>
          {ref ? (
            <Button type='button' variant='secondary' onClick={hide}>
              cancel
            </Button>
          ) : null}
        </ButtonGroup>
      </form>
    </div>
  )
})

CreateBlog.displayName = 'CreateBlog'

export default CreateBlog

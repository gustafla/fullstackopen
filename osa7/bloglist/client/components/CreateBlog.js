import React, { useState, forwardRef } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogsReducer'

const CreateBlog = forwardRef((_, ref) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    dispatch(createBlog(blog))
    ref && ref.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='title'
            className='blogTitleInput'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='author'
            className='blogAuthorInput'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='url'
            className='blogUrlInput'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit' className='blogCreateButton'>
          create
        </button>
      </form>
    </div>
  )
})

CreateBlog.displayName = 'CreateBlog'

export default CreateBlog

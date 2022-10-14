import { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'

const CreateBlog = forwardRef(({ addBlog }, ref) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // Post blog to backend
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const blog = { title, author, url }
      await addBlog(blog)
      setTitle('')
      setAuthor('')
      setUrl('')
      ref && ref.current.toggleVisibility()
    } catch (exception) {
      console.error('post failed', exception)
    }
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
        <button type='submit' className='blogCreateButton'>create</button>
      </form>
    </div>
  )
})

CreateBlog.displayName = 'CreateBlog'

CreateBlog.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default CreateBlog

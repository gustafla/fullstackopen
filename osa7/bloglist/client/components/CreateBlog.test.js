/** @jest-environment jsdom */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'
import { Provider } from 'react-redux'
import store from '../store'

let addBlog
let container

beforeEach(() => {
  addBlog = jest.fn()
  container = render(
    <Provider store={store}>
      <CreateBlog addBlog={addBlog} />
    </Provider>,
  ).container
})

test('calls addBlog when created', async () => {
  const user = userEvent.setup()
  const title = container.querySelector('.blogTitleInput')
  const author = container.querySelector('.blogAuthorInput')
  const url = container.querySelector('.blogUrlInput')
  const button = container.querySelector('.blogCreateButton')
  await user.type(title, 'Rust Blog')
  await user.type(author, 'Rust Teams')
  await user.type(url, 'https://blog.rust-lang.org')
  await user.click(button)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: 'Rust Blog',
    author: 'Rust Teams',
    url: 'https://blog.rust-lang.org',
  })
})

/** @jest-environment jsdom */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'fullstackopen.com',
  likes: 999,
}

let handleLike
let handleRemove
let container

beforeEach(() => {
  handleLike = jest.fn()
  handleRemove = jest.fn()
  container = render(
    <Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} />,
  ).container
})

test('renders title and author but not details', () => {
  expect(container.innerHTML).toContain(blog.title)
  expect(container.innerHTML).toContain(blog.author)
  expect(container.innerHTML).not.toContain(blog.url)
  expect(container.innerHTML).not.toContain(blog.likes.toString())
})

test('renders full details when clicked', async () => {
  const user = userEvent.setup()
  const frame = container.querySelector('.blog')
  await user.click(frame)

  expect(container.innerHTML).toContain(blog.title)
  expect(container.innerHTML).toContain(blog.author)
  expect(container.innerHTML).toContain(blog.url)
  expect(container.innerHTML).toContain(blog.likes.toString())
})

test('like button calls handler every time', async () => {
  const user = userEvent.setup()
  const frame = container.querySelector('.blog')
  await user.click(frame)
  const button = screen.getByText('like')

  expect(handleLike.mock.calls).toHaveLength(0)
  await user.click(button)
  expect(handleLike.mock.calls).toHaveLength(1)
  await user.click(button)
  await user.click(button)
  expect(handleLike.mock.calls).toHaveLength(3)
})

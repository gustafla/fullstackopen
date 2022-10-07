const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML Lifestyle',
    author: 'Developer Trends',
    url: 'https://placeholder.dev/blog',
    likes: 0,
  },
  {
    title: 'Rust Blog',
    author: 'Rust Teams',
    url: 'https://blog.rust-lang.org/',
    likes: 9001,
  },
]


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(blog => blog.title)

  expect(contents).toContain('Rust Blog')
})

afterAll(() => {
  mongoose.connection.close()
})

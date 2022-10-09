const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

test('blogs have id fields', async () => {
  const response = await api.get('/api/blogs')

  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('post adds blogs', async () => {
  const newblog = {
    title: 'Hello World',
    author: 'Testaaja',
    url: 'http://localhost',
    likes: 42,
  }

  const response = await api
    .post('/api/blogs')
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.title).toContain('Hello World')
  expect(response.body.author).toContain('Testaaja')
  expect(response.body.url).toContain('http://localhost')
  expect(response.body.likes).toBe(42)

  const getResponse = await api.get('/api/blogs')
  expect(getResponse.body).toHaveLength(3)

})

afterAll(() => {
  mongoose.connection.close()
})

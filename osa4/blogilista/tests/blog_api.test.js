const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('when there are initially some blogs saved', () => {
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

  describe('addition of a new blog', () => {
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

    test('post without likes creates blog with zero likes', async () => {
      const newblog = {
        title: 'Hello World 2',
        author: 'Testaajat',
        url: 'http://testserver.lan',
      }

      const response = await api
        .post('/api/blogs')
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toContain('Hello World 2')
      expect(response.body.author).toContain('Testaajat')
      expect(response.body.url).toContain('http://testserver.lan')
      expect(response.body.likes).toBe(0)

      const getResponse = await api.get('/api/blogs')
      expect(getResponse.body).toHaveLength(3)
    })

    test('post without title results in bad request', async () => {
      const newblog = {
        author: 'Testaajat',
        url: 'http://gamer.cool',
      }

      await api.post('/api/blogs').send(newblog).expect(400)

      const getResponse = await api.get('/api/blogs')
      expect(getResponse.body).toHaveLength(2)
    })

    test('post without url results in bad request', async () => {
      const newblog = {
        title: 'Lost and directionless',
        author: 'Testaajat',
      }

      await api.post('/api/blogs').send(newblog).expect(400)

      const getResponse = await api.get('/api/blogs')
      expect(getResponse.body).toHaveLength(2)
    })

    test('post without fields results in bad request', async () => {
      await api.post('/api/blogs').send({}).expect(400)

      const getResponse = await api.get('/api/blogs')
      expect(getResponse.body).toHaveLength(2)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if valid id', async () => {
      const blogs = await helper.blogsInDb()
      const deleteBlog = blogs[1]

      await api.delete(`/api/blogs/${deleteBlog.id}`).expect(204)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogs.length - 1)

      expect(blogsAfter.map(b => b.title)).not.toContain(deleteBlog.title)

      // Should respond 204 again
      await api.delete(`/api/blogs/${deleteBlog.id}`).expect(204)

      const blogsAfterTwice = await helper.blogsInDb()
      expect(blogsAfterTwice).toHaveLength(blogs.length - 1)
    })

    test('fails with status 400 if invalid id', async () => {
      const blogs = await helper.blogsInDb()
      const deleteBlogId = blogs[1].id + 'asdf'

      await api.delete(`/api/blogs/${deleteBlogId}`).expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogs.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

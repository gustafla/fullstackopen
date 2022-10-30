const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

// Authorization token for api usage
let authorization

const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  let user = new User({ username, passwordHash })
  user = await user.save()
  return user
}

const logUserIn = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  return { Authorization: `Bearer ${response.body.token}` }
}

beforeEach(async () => {
  // Create users in db
  await User.deleteMany({})
  const [username, password] = ['lauri', 'password']
  let user = await createUser(username, password)

  // Create blogs for the new user
  await Blog.deleteMany({})
  const blogs = helper.initialBlogs.map(b => ({ ...b, user: user._id }))
  const inserted = await Blog.insertMany(blogs)

  // Set blog ids to user document
  user.blogs = inserted.map(b => b._id.toString())
  user = await user.save()

  // Get a valid auth for user
  authorization = await logUserIn(username, password)
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set(authorization)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set(authorization)
      .expect(200)

    expect(response.body).toHaveLength(2)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set(authorization)
      .expect(200)

    const contents = response.body.map(blog => blog.title)

    expect(contents).toContain('Rust Blog')
  })

  test('blogs have id fields', async () => {
    const response = await api
      .get('/api/blogs')
      .set(authorization)
      .expect(200)

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

      const response = await api.post('/api/blogs')
        .set(authorization)
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toBe('Hello World')
      expect(response.body.author).toBe('Testaaja')
      expect(response.body.url).toBe('http://localhost')
      expect(response.body.likes).toBe(42)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(3)
    })

    test('post without likes creates blog with zero likes', async () => {
      const newblog = {
        title: 'Hello World 2',
        author: 'Testaajat',
        url: 'http://testserver.lan',
      }

      const response = await api.post('/api/blogs')
        .set(authorization)
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toBe('Hello World 2')
      expect(response.body.author).toBe('Testaajat')
      expect(response.body.url).toBe('http://testserver.lan')
      expect(response.body.likes).toBe(0)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(3)
    })

    test('post without title results in bad request', async () => {
      const newblog = {
        author: 'Testaajat',
        url: 'http://gamer.cool',
      }

      await api.post('/api/blogs')
        .set(authorization)
        .send(newblog)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(2)
    })

    test('post without url results in bad request', async () => {
      const newblog = {
        title: 'Lost and directionless',
        author: 'Testaajat',
      }

      await api.post('/api/blogs')
        .set(authorization)
        .send(newblog)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(2)
    })

    test('post without fields results in bad request', async () => {
      await api.post('/api/blogs')
        .set(authorization)
        .send({})
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(2)
    })

    test('post without authorization token results in unauthorized', async () => {
      const newblog = {
        title: 'Banned from the Internet',
        url: 'https://access.denied',
        author: 'Testaajat',
      }

      const result = await api.post('/api/blogs')
        .send(newblog)
        .expect(401)

      expect(result.body.error).toContain('authorization token required')

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(2)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if valid id', async () => {
      const blogs = await helper.blogsInDb()
      const deleteBlog = blogs[1]

      await api
        .delete(`/api/blogs/${deleteBlog.id}`)
        .set(authorization)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogs.length - 1)

      expect(blogsAfter.map(b => b.title)).not.toContain(deleteBlog.title)

      // Should respond 204 again
      await api
        .delete(`/api/blogs/${deleteBlog.id}`)
        .set(authorization)
        .expect(204)

      const blogsAfterTwice = await helper.blogsInDb()
      expect(blogsAfterTwice).toHaveLength(blogs.length - 1)
    })

    test('fails with status 400 if invalid id', async () => {
      const blogs = await helper.blogsInDb()
      const deleteBlogId = blogs[1].id + 'asdf'

      await api
        .delete(`/api/blogs/${deleteBlogId}`)
        .set(authorization)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toHaveLength(blogs.length)
    })
  })

  describe('requesting changes to a blog', () => {
    test('succeeds if valid id and likes', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      const changedBlog = { ...blog, likes: 900 }

      await api
        .put(`/api/blogs/${blog.id}`)
        .set(authorization)
        .send(changedBlog)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toContainEqual(changedBlog)
      expect(blogsAfter).not.toContainEqual(blog)
    })

    test('fails if invalid id', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      const changedBlog = { ...blog, likes: 900 }

      await api
        .put(`/api/blogs/${blog.id + 'asdf'}`)
        .set(authorization)
        .send(changedBlog)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).not.toContainEqual(changedBlog)
      expect(blogsAfter).toContainEqual(blog)
    })

    test('fails without likes', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]

      await api
        .put(`/api/blogs/${blog.id}`)
        .set(authorization)
        .send({})
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      expect(blogsAfter).toContainEqual(blog)
    })

    test('changes nothing but likes', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      const fakeId = helper.nonExistingId()
      const changedBlog = {
        title: '123',
        author: '123',
        url: '123',
        likes: blog.likes + 32,
        _id: fakeId,
        id: fakeId,
      }

      const response = await api
        .put(`/api/blogs/${blog.id}`)
        .set(authorization)
        .send(changedBlog)
        .expect(200)

      expect(response.body.title).toBe(blog.title)
      expect(response.body.author).toBe(blog.author)
      expect(response.body.url).toBe(blog.url)
      expect(response.body.likes).toBe(blog.likes + 32)

      const blogsAfter = await helper.blogsInDb()
      const expectedBlog = { ...blog, likes: blog.likes + 32 }
      expect(blogsAfter).toContainEqual(expectedBlog)
    })

    test('users can like each others posts', async () => {
      await createUser('root', 'sekret')
      const rootAuthorization = await logUserIn('root', 'sekret')
      const blogs = await helper.blogsInDb()
      const blog = blogs[0]
      const likedBlog = { ...blog, likes: blog.likes + 1 }

      const response = await api
        .put(`/api/blogs/${blog.id}`)
        .set(rootAuthorization)
        .send(likedBlog)
        .expect(200)

      expect(response.body.likes).toBe(likedBlog.likes)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

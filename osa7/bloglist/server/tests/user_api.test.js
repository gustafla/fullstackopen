const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('shown users have expected fields', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    for (const user of response.body) {
      expect(user.username).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.blogs).toBeDefined()
      expect(user.passwordHash).not.toBeDefined()
      expect(user._id).not.toBeDefined()
      expect(user.__v).not.toBeDefined()
    }
  })

  describe('creating a new user', () => {
    test('post succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'gustafla',
        name: 'Lauri Gustafsson',
        password: 'hunter2',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)

      const names = usersAtEnd.map((u) => u.name)
      expect(names).toContain(newUser.name)
    })

    test('post succeeds without a name', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        password: 'hunter2',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('post fails without a password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'fullstackopen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'password must be at least 3 characters',
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).not.toContain(newUser.username)
    })

    test('post fails without an username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Lauri Gustafsson',
        password: 'hunter2',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const names = usersAtEnd.map((u) => u.name)
      expect(names).not.toContain(newUser.name)
    })

    test('post fails with a too short username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'hi',
        password: 'hunter2',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'username must be at least 3 characters',
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).not.toContain(newUser.username)
    })

    test('post fails with a too short password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'code1038',
        name: 'Cody',
        password: 'pw',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'password must be at least 3 characters',
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const names = usersAtEnd.map((u) => u.name)
      expect(names).not.toContain(newUser.name)
    })

    test('post fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username is already registered')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

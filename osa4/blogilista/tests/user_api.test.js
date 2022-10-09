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
    const user = new User({ username: 'root', name: 'Woot Woot Got Root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
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

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('shown users have expected fields', async () => {
    const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    const users = await helper.usersInDb()

    for (const user of response.body) {
      expect(user.username).toBeDefined()
      expect(user.name).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.blogs).not.toBeDefined()
      expect(user.passwordHash).not.toBeDefined()
      expect(user._id).not.toBeDefined()
      expect(user.__v).not.toBeDefined()
    }
  })
})

afterAll(() => {
  mongoose.connection.close()
})

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, config.JWT_SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  console.info('token authorizes for', decodedToken.username)
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const decodedToken = jwt.verify(request.token, config.JWT_SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  console.info('token authorizes for', decodedToken.username)
  const user = await User.findById(decodedToken.id)

  const result = await Blog.findById(id)
  if (result) {
    if (result.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'token does not authorize delete for this resource' })
    }
    await result.remove()
    logger.info('deleted', result)
  }

  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  if (!body.likes) {
    return response.status(400).end()
  }
  const changes = {
    likes: body.likes
  }
  const blog = await Blog.findByIdAndUpdate(id, changes, { new: true, runValidators: true, context: 'query' })
  if (blog) {
    return response.json(blog)
  }
})

module.exports = blogsRouter

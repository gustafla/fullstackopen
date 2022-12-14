const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: [],
  })

  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  const withUser = await result.populate('user', { username: 1, name: 1 })
  response.status(201).json(withUser)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const user = request.user

  const result = await Blog.findById(id)
  if (result) {
    if (result.user && result.user.toString() !== user._id.toString()) {
      return response
        .status(401)
        .json({ error: 'token does not authorize for this resource' })
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
    return response
      .status(400)
      .json({ error: 'request must have a field called likes' })
  }

  const result = await Blog.findById(id)
  if (result) {
    result.likes = body.likes

    const updated = await result.save()
    const withUser = await updated.populate('user', { username: 1, name: 1 })
    return response.json(withUser)
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const id = request.params.id
  const body = request.body

  if (!body.comment) {
    return response
      .status(400)
      .json({ error: 'request must have a fields called comment' })
  }

  const result = await Blog.findById(id)
  if (result) {
    result.comments.push(body)

    const updated = await result.save()
    const withUser = await updated.populate('user', { username: 1, name: 1 })
    return response.json(withUser)
  }
})

module.exports = blogsRouter

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const result = await blog.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndRemove(id)
  if (result) {
    logger.info('deleted', result)
  }
  response.status(204).end()
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

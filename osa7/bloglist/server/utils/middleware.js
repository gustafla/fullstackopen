const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'authorization token required' })
  }
  const decodedToken = jwt.verify(request.token, config.JWT_SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid authorization token' })
  }

  logger.info('token authorizes for', decodedToken.username)
  const user = await User.findById(decodedToken.id)
  if (!user) {
    // User has been deleted before this token expired
    logger.info('request has deleted users token')
    return response.status(401).json({ error: 'invalid authorization token' })
  }

  request.user = user
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid authorization token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'expired authorization token' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}

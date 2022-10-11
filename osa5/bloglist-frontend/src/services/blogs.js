import axios from 'axios'
const baseUrl = '/api/blogs'
const instance = axios.create()

let authorization = null
let expiredHandler = null

// Set authorization header for all requests using this module's instance
instance.interceptors.request.use(config => {
  config.headers = { ...config.headers, Authorization: authorization }
  return config
})

// Run a callback handler for all expired requests
instance.interceptors.response.use(res => res, error => {
  const data = error.response.data
  if (expiredHandler && data.error && data.error.includes('expired')) {
    expiredHandler()
  }
  return Promise.reject(error)
})

const setToken = (newToken) => {
  authorization = `Bearer ${newToken}`
}

const setExpiredHandler = (newExpiredHandler) => {
  expiredHandler = newExpiredHandler
}

const getAll = async () => {
  const response = await instance.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const response = await instance.post(baseUrl, blog)
  return response.data
}

export default { setToken, setExpiredHandler, getAll, create }
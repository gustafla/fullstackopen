import axios from 'axios'
const baseUrl = '/api/blogs'
const instance = axios.create()

let authorization = null
let expiredHandler = null
let notificationControl = null

// Set authorization header for all requests using this module's instance
instance.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: authorization }
  return config
})

// Run a callback handler for all expired requests
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response.data
    if (data.error) {
      if (notificationControl) {
        notificationControl.setError(data.error)
      }
      if (expiredHandler && data.error.includes('expired')) {
        expiredHandler()
      }
      return Promise.reject(error)
    }
  },
)

const setToken = (newToken) => {
  authorization = `Bearer ${newToken}`
}

const setExpiredHandler = (newExpiredHandler) => {
  expiredHandler = newExpiredHandler
}

const setNotificationControl = (newNotificationControl) => {
  notificationControl = newNotificationControl
}

const getAll = async () => {
  const response = await instance.get(baseUrl)
  return response.data
}

const create = async (blog) => {
  const response = await instance.post(baseUrl, blog)
  const data = response.data
  notificationControl &&
    notificationControl.setSuccess(`${data.title} by ${data.author} added!`)
  return data
}

const update = async (blog) => {
  const response = await instance.put(`${baseUrl}/${blog.id}`, blog)
  const data = response.data
  notificationControl &&
    notificationControl.setSuccess(`${data.title} by ${data.author} updated!`)
  return response.data
}

const remove = async (blog) => {
  await instance.delete(`${baseUrl}/${blog.id}`)
  notificationControl &&
    notificationControl.setSuccess(`${blog.title} by ${blog.author} removed!`)
}

const blogService = {
  setToken,
  setExpiredHandler,
  setNotificationControl,
  getAll,
  create,
  update,
  remove,
}

export default blogService

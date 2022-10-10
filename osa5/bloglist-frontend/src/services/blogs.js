import axios from 'axios'
const baseUrl = '/api/blogs'

let authorization = null

const setToken = newToken => {
  authorization = { Authorization: `Bearer ${newToken}` }
}

const getAll = async () => {
  const response = await axios.get(baseUrl, { headers: { ...authorization } })
  return response.data
}

const create = async (blog) => {
  const response = await axios.post(baseUrl, blog, { headers: { ...authorization } })
  return response.data
}

export default { setToken, getAll, create }
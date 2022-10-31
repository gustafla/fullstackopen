import axios from 'axios'
const baseUrl = '/api/blogs'

const auth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

const getAll = async (token) => {
  const response = await axios.get(baseUrl, auth(token))
  return response.data
}

const create = async (token, blog) => {
  const response = await axios.post(baseUrl, blog, auth(token))
  return response.data
}

const update = async (token, blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, auth(token))
  return response.data
}

const remove = async (token, blog) => {
  await axios.delete(`${baseUrl}/${blog.id}`, auth(token))
}

const blogService = {
  getAll,
  create,
  update,
  remove,
}

export default blogService

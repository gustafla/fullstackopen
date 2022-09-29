import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl).then((resp) => resp.data)
}

const create = (person) => {
  return axios.post(baseUrl, person).then((resp) => resp.data)
}

export default { getAll, create }

import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then((resp) => resp.data)
}

const create = (person) => {
  return axios.post(baseUrl, person).then((resp) => resp.data)
}

const remove = (person) => {
  return axios.delete(`${baseUrl}/${person.id}`)
}

const update = (person) => {
  return axios.put(`${baseUrl}/${person.id}`, person)
}

export default { getAll, create, remove, update }

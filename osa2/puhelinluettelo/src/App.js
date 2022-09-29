import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Initially fetch phonebook from server
  useEffect(() => {
    console.log("Initial fetch effect")
    axios
      .get("http://localhost:3001/persons")
      .then(resp => {
        console.log("Initial fetch fulfilled")
        setPersons(resp.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const person = { name: newName, number: newNumber }
      axios.post("http://localhost:3001/persons", person).then((resp) => {
        setPersons(persons.concat(resp.data))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <ContactForm nameValue={newName} handleNameChange={handleNameChange} numberValue={newNumber} handleNumberChange={handleNumberChange} handleSubmitClick={addPerson} />
      <h3>Numbers</h3>
      <ContactList persons={persons} filter={filter} />
    </div >
  )
}

export default App

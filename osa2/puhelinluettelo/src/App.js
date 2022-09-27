import { useState } from 'react'
import Filter from './components/Filter'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
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

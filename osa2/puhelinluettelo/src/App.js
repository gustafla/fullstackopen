import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Initially fetch phonebook from server
  useEffect(() => {
    console.log("Initial fetch effect")
    personService.getAll().then(persons => {
      console.log("Initial fetch fulfilled")
      setPersons(persons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)

    if (!existingPerson) {
      const newPerson = { name: newName, number: newNumber }
      personService.create(newPerson).then((person) => {
        setPersons(persons.concat(person))
      })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)) {
        const updated = { ...existingPerson, number: newNumber }
        console.log(updated)
        personService.update(updated).then(() => {
          setPersons(persons.map(person => person.id === updated.id ? updated : person))
        })
      } else return
    }

    setNewName('')
    setNewNumber('')
  }

  const removePerson = (person) => {
    if (window.confirm(`Remove ${person.name}?`)) {
      console.log("removing", person)
      personService.remove(person).then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
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
      <ContactList persons={persons} filter={filter} removePerson={removePerson} />
    </div >
  )
}

export default App

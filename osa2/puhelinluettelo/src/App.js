import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => setSuccessMessage(null), 5000)
        setPersons(persons.concat(person))
      }).catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => setErrorMessage(null), 5000)
      })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)) {
        const updated = { ...existingPerson, number: newNumber }
        console.log(updated)
        personService.update(updated).then(() => {
          setSuccessMessage(`Updated ${newName}`)
          setTimeout(() => setSuccessMessage(null), 5000)
          setPersons(persons.map(person => person.id === updated.id ? updated : person))
        }).catch(error => {
          setErrorMessage(`Failed to change ${newName} on the server: ${error.response.data.error}`)
          setTimeout(() => setErrorMessage(null), 5000)
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
        setSuccessMessage(`Removed ${person.name}`)
        setTimeout(() => setSuccessMessage(null), 5000)
        setPersons(persons.filter(p => p.id !== person.id))
      }).catch(error => {
        setErrorMessage(`Removing ${person.name} failed: ${error.response.data.error}`)
        setTimeout(() => setErrorMessage(null), 5000)
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
      <Notification message={errorMessage} className="error" />
      <Notification message={successMessage} className="success" />
      <Filter value={filter} handleChange={handleFilterChange} />
      <h3>Add a new</h3>
      <ContactForm nameValue={newName} handleNameChange={handleNameChange} numberValue={newNumber} handleNumberChange={handleNumberChange} handleSubmitClick={addPerson} />
      <h3>Numbers</h3>
      <ContactList persons={persons} filter={filter} removePerson={removePerson} />
    </div >
  )
}

export default App

import React from 'react'

const ContactList = ({ persons, filter, removePerson }) => {
  const filterPersons = (person) => person.name.toLowerCase().includes(filter.toLowerCase())

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        {persons.filter(filterPersons).map(person =>
          <tr key={person.name}>
            <td>{person.name}</td>
            <td>{person.number}</td>
            <td><button type="button" onClick={() => removePerson(person)}>remove</button></td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ContactList

const ContactList = ({ persons, filter }) => {
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
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ContactList

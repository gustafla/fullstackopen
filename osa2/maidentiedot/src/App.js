import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Official name: {country.name.official}</p>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area} km²</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(lang => <li key={lang[0]}>{lang[1]}</li>)}
      </ul>
      <img src={country.flags.svg} style={{ width: '33%' }} />
    </div>
  )
}

const CountryList = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  }

  return (
    <div>
      {countries.map(cnt => <p key={cnt.cca3}>{cnt.name.common}</p>)}
    </div>
  )
}

const Filter = ({ handleChange }) => {
  return (
    <div>
      find countries <input onChange={handleChange} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    console.log("Initial fetch effect")
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((resp) => {
        console.log("Initial fetch fulfilled")
        setCountries(resp.data)
      })
  }, [])

  const filterCountries = cnt =>
    (`${cnt.name.official} ${cnt.name.common}`)
      .toLowerCase()
      .includes(filter.toLowerCase())

  return (
    <div>
      <Filter handleChange={event => setFilter(event.target.value)} />
      <CountryList countries={countries.filter(filterCountries)} />
    </div>
  );
}

export default App;

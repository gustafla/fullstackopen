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

const CountryList = ({ countries, showCountryOverride, handleShowCountry }) => {
  if (countries.length === 1 || !!showCountryOverride) {
    return (
      <Country country={showCountryOverride ? showCountryOverride : countries[0]} />
    )
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 0) {
    return <p>Nothing to show, change your search</p>
  }

  return (
    <div>
      {countries.map(cnt =>
        <div key={cnt.cca3}>
          {cnt.name.common} <button onClick={handleShowCountry} id={cnt.cca3}>show</button>
        </div>
      )}
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
  const [showCountryOverride, setShowCountryOverride] = useState(null)

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

  const handleFilterChange = event => {
    console.log("Filter update")
    setFilter(event.target.value)
    setShowCountryOverride(null)
  }

  const handleShowCountry = event => {
    console.log("Show country override")
    const cca3 = event.target.id
    const cnt = countries.find(cnt => cnt.cca3 === cca3)
    setShowCountryOverride(cnt)
  }

  return (
    <div>
      <Filter handleChange={handleFilterChange} />
      <CountryList countries={countries.filter(filterCountries)} handleShowCountry={handleShowCountry} showCountryOverride={showCountryOverride} />
    </div>
  );
}

export default App;

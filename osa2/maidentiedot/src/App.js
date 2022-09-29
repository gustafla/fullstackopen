import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'

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
    const cnt = countries.find(cnt => cnt.cca3 === event.target.value)
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

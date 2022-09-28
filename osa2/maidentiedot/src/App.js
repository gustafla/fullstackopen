import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    setWeather(null)
    console.log("Weather fetch effect")
    const key = process.env.REACT_APP_API_KEY
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca3}&units=metric&appid=${key}`)
      .then(resp => {
        console.log("Weather fetch fulfilled")
        setWeather(resp.data)
      })
  }, [country])

  if (!weather) {
    return <p>No weather information available</p>
  }

  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>Temperature: {weather.main.temp}°C (feels like {weather.main.feels_like}°C)</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>Wind: {weather.wind.speed}m/s</p>
    </div>
  )
}

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
      <img src={country.flags.svg} style={{ width: '33%' }} alt={`Flag of ${country.name.common}`} />
      <Weather country={country} />
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
          {cnt.name.common} <button type="button" onClick={handleShowCountry} value={cnt.cca3}>show</button>
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

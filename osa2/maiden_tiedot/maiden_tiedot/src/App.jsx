import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherInfo = ({ capital, apiKey }) => {
  const [weather, setWeather] = useState(null);


  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`
        );
        setWeather(response.data);
      } catch (error) {
        console.log(error);
        setWeather(null);
      }
    };

    fetchWeatherData();
  }, [capital, apiKey]);

  if (!weather) {
    return null;
  }

  const temperature = Math.round(weather.main.temp - 273.15);
  const weatherDescription = weather.weather[0].description;
  const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
  const windSpeed = weather.wind.speed; 
  
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {temperature}°C</p>
      <p>Description: {weatherDescription}</p>
      <img src={weatherIcon} alt="Weather Icon" />
      <p>wind: {windSpeed} m/s</p>
    </div>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      return;
    }

    axios
      .get(`https://restcountries.com/v3.1/name/${searchTerm}`)
      .then(response => {
        const filteredCountries = response.data.filter(country =>
          country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCountries(filteredCountries);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, [searchTerm]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
    setSelectedCountry(null); // Reset selected country when searching
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  const apiKey = '183bd3d9d8ccc2d32a2431198b14f536';

  return (
    <div>
      <h1>Country Information</h1>
      <form onSubmit={e => e.preventDefault()}>
        <label htmlFor="searchInput">Search Country:</label>
        <input
          id="searchInput"
          type="text"
          value={searchTerm}
          onChange={handleChange}
        />
      </form>
      {countries.length >= 10 && <p>Too many matches, please specify another filter</p>}
      {countries.length < 10 && countries.length > 1 && (
        <ul>
          {countries.map(country => (
            <li key={country.name.common} onClick={() => handleCountrySelect(country)}>
              {country.name.common} 
              <button onClick={() => handleButtonClick(country)}>Get Weather</button>
            </li>
          ))}
        </ul>
      )}
      {countries.length === 1 && (
        countries.map(country => (
          <div key={country.name.common} onClick={() => handleCountrySelect(country)}>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km²</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(country.languages).map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt={`${country.name.common} Flag`} style={{ width: '200px' }} />
            <WeatherInfo capital={country.capital[0]} apiKey={apiKey} /> {/* Moved WeatherInfo here */}
          </div>
        ))
      )}
      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(selectedCountry.languages).map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
          <img src={selectedCountry.flags.png} alt={`${selectedCountry.name.common} Flag`} style={{ width: '200px' }} />
          <WeatherInfo capital={selectedCountry.capital[0]} apiKey={apiKey} /> {/* Moved WeatherInfo here */}
        </div>
      )}
    </div>
  );
};

export default App;

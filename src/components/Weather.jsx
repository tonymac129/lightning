import { useEffect, useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(0);
  const [mode, setMode] = useState(
    localStorage.getItem("lightning-temp") ? JSON.parse(localStorage.getItem("lightning-temp")) : true
  );
  const [humidity, setHumidity] = useState("");
  const [description, setDescription] = useState("");
  const [src, setSrc] = useState("");
  const iconMap = {
    Clouds: "cloud",
    Clear: "noon",
    Atmosphere: "mist",
    Snow: "snow",
    Rain: "shower",
    Drizzle: "shower",
    Thunderstorm: "storm",
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => localStorage.setItem("lightning-temp", mode), [mode]);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getCity(latitude, longitude);
  }

  function error(err) {
    console.error(`Error: ${err.code} - ${err.message}`);
    alert("Please allow location access in your browser to see weather data!");
  }

  async function getCity(latitude, longitude) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
      import.meta.env.VITE_GEOCODING_API_KEY
    }`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCity(data.results[0].components.city || data.results[0].components.town || data.results[0].components.village);
      const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }`
      );
      const weatherData = await weather.json();
      setTemp(Math.round(weatherData.main.temp - 273.15));
      setHumidity(weatherData.main.humidity + "%");
      setDescription(
        weatherData.weather[0].description
          .split(" ")
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ")
      );
      setSrc(`/lightning/icons/${iconMap[weatherData.weather[0].main]}.svg`);
    } catch (err) {
      console.error("Error fetching city:", err);
    }
  }

  return (
    <div className="panel">
      {description.length > 0 ? (
        <>
          <span className="weather-city">{city} Weather</span>
          <div className="weather-content">
            <img className="weather-img" src={src} />
            <div className="weather-info">
              <div className="weather-numbers">
                <span
                  onClick={() => {
                    setMode(!mode);
                  }}
                >
                  {mode ? Math.round((temp * 9) / 5 + 32) : temp}°{mode ? "F" : "C"}
                </span>
                <span>{humidity}</span>
              </div>
              <span className="weather-description">{description}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="message">Fetching weather data...</div>
      )}
    </div>
  );
}

export default Weather;

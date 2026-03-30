import React, { useEffect, useState } from 'react'

import Header from './components/Header';
import DefaultScreen from './components/DefaultScreen';
import SearchResult from './components/SearchResult.jsx';
import { fetchWeatherApi } from 'openmeteo';
import { weatherCodesMapping } from './util.js';
const App = () => {
  const [dailyForecast,setDailyForecast] = useState(null);
  const [hourlyForecast,setHourlyForecast] = useState(null);
  const [dataLoading,setDataLoading] = useState(true);
  const [forecastLocation,setForecastLocation] = useState({
    label: "London",
    lat: 51.5072,
    lon: 0.1276,
  });
  const [showResultScreen,setShowResultScreen] = useState(false);
   
  const filterAndFlagClosesTime = function(data){
    const currentDate = new Date();
    const entries = Object.entries(data)
    // console.log(entries);

    //[["time", "{obj.values"],["time2", "{obj.values2"]]
    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString);
      return(
        date.getDate() === currentDate.getDate() && 
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      )
    })
    let closetTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]))
    let closestTimeDiffIndex = 0;

    todayData.forEach(([dateString],index) => {
      const  timeDiff = Math.abs(currentDate - new Date(dateString));
      if(timeDiff < closetTimeDiff){
        closetTimeDiff = timeDiff;
        closestTimeDiffIndex = index;
      }
      // console.log(closetTimeDiff);
      // console.log(closetTimeDiffIndex);
    })
    const result = todayData.map(([dateString,values],index) => ({
      date : dateString,values,
      isClosestTime: index === closestTimeDiffIndex, 
    }));
    return result;
  }
 

  function processData(hourly,daily){

    function convertTimeToObjectArray(times,values){
      if(!times || !values || !values.weatherCode){
        return {}
      }
      
      const obj = {}

      times.forEach((time,timeIndex) => {
        if (!time) return;

        const weatherProperties = {};

        Object.keys(values).forEach(property =>{
          if(values[property] && values[property][timeIndex] !== undefined){
            weatherProperties[property] = values[property][timeIndex];
          }
        });
        const weatherCode = values.weatherCode[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label

        obj[time] = {
          ...weatherProperties,
          weatherCondition,
        }
      })
      console.log(obj);
      return obj;
    }
    
    const dailyData = convertTimeToObjectArray(daily.time,{
      weatherCode: daily.weatherCode,
      temperatureMax: daily.temperatureMax,
      temperatureMin: daily.temperatureMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      windSpeedMax: daily.windSpeedMax,
      windDirectionDominant: daily.windDirectionDominant,
      uvIndexMax: daily.uvIndexMax,
     precipitationSum: daily.precipitationSum,

    })

    const hourlyFormatted = convertTimeToObjectArray(hourly.time,{
      temperature2m: hourly.temperature2m,
      weatherCode: hourly.weatherCode,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitationProbability: hourly. precipitation_probability,
      humidity: hourly.humidity,
      windSpeed: hourly.windSpeed,
      cloudCover: hourly.cloudCover,
      surfacePressure: hourly.surfacePressure
  });
  const hourlyData = filterAndFlagClosesTime(hourlyFormatted);
  return {hourlyData,dailyData}
  }

  const fetchWeather = async(lat,lon, switchToResultScreen  ) => {
    const params = {
      latitude: lat ?? 26.6139,
      longitude: lon ?? 77.209,
      hourly : [
         "temperature_2m",
         "weather_code",
         "visibility",
         "wind_direction_10m",
         "apparent_temperature","precipitation_probability","relative_humidity_2m",
         "wind_speed_10m",
         "cloud_cover",
         "surface_pressure"
      ],
      daily:[
        "wind_speed_10m_max","wind_direction_10m_dominant","temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max","apparent_temperature_min",
        "weather_code",
        "uv_index_max",
        "precipitation_sum"
      ],
      timezone: "auto",
    }
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params); 

    // Helper function to form time ranges
    const range = (start, stop, step) => 
        Array.from({length: ((stop - start) / step)}, (_, i) => start + i * step);
// Process the first location . Add a for loop for multiple locations or weather models
    const response = responses[0];
    // console.log(responses);

    // Attributes for the time location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly  = response.hourly();
    const daily = response.daily();

    const weatherData = {
      hourly:{
        time:range(Number(hourly.time()),Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds)* 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        weatherCode: hourly.variables(1).valuesArray(),
        visibility: hourly.variables(2).valuesArray(),
        windDirection10m : hourly.variables(3).valuesArray(),
        apparentTemperature: hourly.variables(4).valuesArray(),
        precipitation_probability: hourly.variables(5).valuesArray(),
        humidity: hourly.variables(6).valuesArray(),
        windSpeed: hourly.variables(7).valuesArray(),
        cloudCover: hourly.variables(8).valuesArray(),
        surfacePressure: hourly.variables(9).valuesArray()
      },
      daily:{
        time:range(Number(daily.time()),Number(daily.timeEnd()), daily.interval()).map((t) => new Date((t + utcOffsetSeconds)* 1000)),
       
        windSpeedMax: daily.variables(0).valuesArray(),
        windDirectionDominant: daily.variables(1).valuesArray(),
        temperatureMax: daily.variables(2).valuesArray(),
        temperatureMin: daily.variables(3).valuesArray(),
        apparentTemperatureMax: daily.variables(4).valuesArray(),
        apparentTemperatureMin: daily.variables(5).valuesArray(),
        weatherCode: daily.variables(6).valuesArray(),
        uvIndexMax: daily.variables(7).valuesArray(),
        precipitationSum: daily.variables(8).valuesArray()
      }
    }
  
        // console.log(weatherData);
         const {hourlyData, dailyData} = processData(weatherData.hourly,weatherData.daily)

         setDailyForecast(dailyData);
         setHourlyForecast(hourlyData);
         setDataLoading(false)
         if(switchToResultScreen){
          setShowResultScreen(true);
         }
  }
  useEffect(() => {
   
    try {
      setDataLoading(true);
      if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition((position) => {
          const {latitude,longitude} = position.coords;
           
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=10&format=jsonv2`).then((response) => 
            response.json()).then((location) => {

              setForecastLocation({
                label: `${
                  location?.address?.city ?? location?.address?.town ?? location?.address?.village ?? location?.address?.suburb}, ${location?.address?.state}, ${location?.address?.country}`,
                  lat:location.lat,
                  lon:location.lon,
              })
              fetchWeather(location.lat,location.lon)
            })
        })
      }
      // fetchWeather();
    } catch (error) {
      console.error(error.message);
    } finally {
      setDataLoading(false);
    }

  },[]);

  const clickHandler = (searchItem) => {
    setDataLoading(true)
    setForecastLocation({
      label: searchItem.label,
      lat: searchItem.lat,
      lon: searchItem.lon, 
    })
    fetchWeather(searchItem.lat, searchItem.lon, true);
  }

  return (
    <div className='app'>
      <Header />
      {!dataLoading && !showResultScreen &&(<DefaultScreen currentWeatherData={hourlyForecast?.length ? hourlyForecast.filter((hour) => hour.isClosestTime) : []}
        forecastLocation={forecastLocation}
        onClickHandler = {clickHandler}
        />)}

        {showResultScreen && !dataLoading && <SearchResult currentWeatherData= {hourlyForecast?.length? hourlyForecast.filter((hour) => hour.isClosestTime) : []}
          dailyForecast = {dailyForecast}
          forecastLocation={forecastLocation}
          hourlyForecast={hourlyForecast}
          />}
      <p className='copyright-text'>&copy; 2025 WSA. All  right reserved</p>
    </div>
  )
};

export default App
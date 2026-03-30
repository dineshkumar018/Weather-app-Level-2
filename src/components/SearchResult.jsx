import React from "react";
import CardLayout from "./UI/CardLayout.jsx";
import { weatherCodesMapping } from "../util.js";
import Location from "../assets/images/location.svg";
import moment from "moment";
import Temperature from "../assets/images/Temperature.svg";
import Eye from "../assets/images/eye.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Water from "../assets/images/water.svg";
import Windy from "../assets/images/windy.svg";
import Cloud from "../assets/images/cloud.svg";
import HourlyForecast from "./HourlyForecast.jsx";
import UnitMetrixComponent from "./UnitMetrixComponent";
import SevenDayForecast from "./SevenDayForecast.jsx";
import TempGraph from "./TempGraph.jsx";

const SearchResult = ({
  forecastLocation,
  dailyForecast,
  currentWeatherData,
  hourlyForecast,
}) => {
  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.values?.weatherCondition}
      </p>

      <CardLayout>
        <div className="flex items-center justify-between">
          <div style={{ width: "30%" }}>
            <img
              src={
                weatherCodesMapping[currentWeatherData[0].values.weatherCode]
                  ?.img
              }
              alt="Weather Img"
              width={48}
              height={48}
            />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>
            <p className="text-blue" style={{ paddingLeft: "30px" }}>
              Today's{" "}
              {moment(new Date(currentWeatherData[0].date)).format("MMM DD")}
            </p>
          </div>
          <div className="temp-container" style={{ width: "auto" }}>
            <img
              src={Temperature}
              alt="thermometer image"
              className="thermometer-img"
            />
            <div>
              <p style={{ fontSize: "144px" }}>
                {parseFloat(
                  currentWeatherData[0].values?.temperature2m
                ).toFixed(0)}
              </p>
              <p>{currentWeatherData[0]?.values?.weatherCondition}</p>
            </div>
            <p
              style={{
                fontSize: "24px",
                alignSelf: "start",
                paddingTop: "45px",
              }}
            >
              ℃
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
              }}
            >
              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={Eye} alt="" />
                  <p className="weather-params-label">Visibility</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0]?.values?.visibility / 1000)}{" "}
                  km
                </p>
              </div>
              <p>|</p>
              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={ThermoMini} alt="" />
                  <p className="weather-params-label">Feels Like</p>
                </div>
                <p>
                  {Math.floor(
                    currentWeatherData[0]?.values?.apparentTemperature
                  )}{" "}
                  ℃
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
                marginTop: "24px",
              }}
            >
              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={Water} alt="" />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{currentWeatherData[0].values?.humidity}%</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={Windy} alt="" />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0]?.values?.windSpeed)}km/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
      <div className="flex justify-between" style={{ marginTop: "24px" }}>
        <HourlyForecast hourlyData={hourlyForecast} />
      </div>
      <div className="flex items-center" style={{ columnGap: "20px" }}>
        <div className="current-time-metrix">
          <CardLayout className="unit-metrix">
            <div className="unit-metrix-container" style={{ marginTop: "0px" }}>
              <UnitMetrixComponent
                label="Temperature"
                value={Math.floor(currentWeatherData[0].values?.temperature2m)}
                unit="℃"
              />

              <UnitMetrixComponent
                label="Wind"
                value={Math.floor(currentWeatherData[0].values?.windSpeed)}
                unit="km/h"
              />
            </div>
            <div className="unit-metrix-container">
              <UnitMetrixComponent
                label="Humidity"
                value={Math.floor(currentWeatherData[0].values?.humidity)}
                unit="%"
              />

              <UnitMetrixComponent
                label="Visibility"
                value={Math.floor(
                  currentWeatherData[0].values?.visibility / 1000
                )}
                unit="km"
              />
            </div>

            <div className="unit-metrix-container">
              <UnitMetrixComponent
                label="Feels Like"
                value={Math.floor(
                  currentWeatherData[0].values?.apparentTemperature
                )}
                unit="℃"
              />

              <UnitMetrixComponent
                label="Chance of Rain"
                value={Math.floor(
                  currentWeatherData[0].values?.precipitationProbability
                )}
                unit="mm"
              />
            </div>

            <div className="unit-metrix-container">
              <UnitMetrixComponent
                label="Cloud Cover"
                value={Math.floor(currentWeatherData[0].values?.cloudCover)}
                unit="%"
              />

              <UnitMetrixComponent
                label="Pressure"
                value={Math.floor(
                  currentWeatherData[0].values?.surfacePressure
                )}
                unit="hpa"
              />
            </div>
          </CardLayout>
        </div>
        <SevenDayForecast dailyForecast={dailyForecast} />
      </div>
      <TempGraph hourlyData={hourlyForecast} />
    </div>
  );
};

export default SearchResult;

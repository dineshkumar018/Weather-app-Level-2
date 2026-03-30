import React from "react";
import CardLayout from "./UI/CardLayout";
import DayForecast from "./UI/DayForecast";
import { weatherCodesMapping } from "../util";
import moment from "moment"

const SevenDayForecast = ({ dailyForecast }) => {
  return (
    <CardLayout className={"seven-day-forecast-card-layout"}>
      <p className="label-18">7 DAY FORECAST</p>
      {Object.keys(dailyForecast)?.length > 0 &&
        Object.keys(dailyForecast).map((day, dayInx) => {
          return (
            <DayForecastCard
              key={dayInx}
              dayData={dailyForecast[day]}
              day={day}
              lastDay={dayInx === 6 ? true : false}
            />
          );
        })}
    </CardLayout>
  );
};

function DayForecastCard({ dayData, day, lastDay }) {
  return (
    <div
      className={`flex items-center single-day justify-between ${
        lastDay ? "border-0" : ""
      }`}
    >
      <p style={{ width: "27%" }}>{moment(day).format("dddd")}</p>
      <img
        src={weatherCodesMapping[dayData.weatherCode].img}
        alt="Weather Data"
        width={48}
        height={48}
      />
      <div
        style={{ width: "62%", marginLeft: "12px" }}
        className="flex items-center justify-between"
      >
        <p className="capitalize">{dayData.weatherCondition}</p>
        <p>
          {Math.floor(dayData.temperatureMin)} -{" "}
          {Math.floor(dayData.temperatureMax)} ℃
        </p>
      </div>
    </div>
  );
}

export default SevenDayForecast;

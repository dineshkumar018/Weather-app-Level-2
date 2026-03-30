import React from 'react'
import CardLayout from './CardLayout'
// import Sun from "../assets/images/sun.svg"
import moment  from "moment";
import { weatherCodesMapping } from '../../util';

const DayForecast = ({data,date}) => {
  return ( 
  <CardLayout>
       <div className='day-forecast-container'>
        <p className='label-18'>{moment(new Date(date)).format("dddd")}</p>
        <p className="text-blue">{moment(new Date(date)).format("MMM DD")}</p>
        <img src={weatherCodesMapping[data.weatherCode].img} alt="" width={48} height={48} />
        <p className='label-18'>{data.weatherCondition}</p>
        <p className="temp-range">{Math.floor(data.temperatureMin)}℃ - {Math.floor(data.temperatureMax)}℃</p>
       </div>
    </CardLayout>
  )
}

export default DayForecast
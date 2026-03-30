import React from 'react'
import wsaLogo from "../assets/images/wsa-logo.svg"

const Header = () => {
  return (
    <div className='header'>
        <img src={wsaLogo} alt="WSA Logo" />
        <p className='header-text'>Weather App</p>
        </div>
  )
}

export default Header
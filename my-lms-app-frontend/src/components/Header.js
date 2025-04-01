import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.jpg';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
        <div className="header-logo">
            <img src={logo} alt="logo" width="140px" height="140px"/>
            <h1>
                <b>LMS - Learning Managment System</b>
            </h1>
        </div>
        <div className="header-navbar">
            <nav className="navbar">
                <div><Link to="/home">Home</Link></div>
                <div><Link to="/coursepage">Courses</Link></div>
                <div><Link to="/login">Login</Link></div>
            </nav>
        </div>
    </header>
    
  );
}

export default Header; 
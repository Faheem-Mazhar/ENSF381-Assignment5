import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpg';
import '../styles/Header.css';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

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
                {isAuthenticated ? (
                    <>
                        <div><button onClick={handleLogout} className="logout-button">Logout</button></div>
                    </>
                ) : (
                    <div><Link to="/login">Login</Link></div>
                )}
            </nav>
        </div>
    </header>
    
  );
}

export default Header; 
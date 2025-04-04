import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DisplayStatus from '../context/DisplayStatus';
import Header from './Header';
import Footer from './Footer';
import '../styles/Login.css';

function Loginpage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [status, setStatus] = useState({ type: '', message: '' });
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
  };

  const validateUsername = (value) => {
    if (!value.trim()) {
        setUsernameError("Username or email is required");
        return false;
    }
    setUsernameError("");
    return true;
};

const validatePassword = (value) => {
    if (!value) {
        setPasswordError("Password is required");
        return false;
    }
    if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        return false;
    }
    setPasswordError("");
    return true;
};

const handleLogin = async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    
    if (!isUsernameValid || !isPasswordValid) {
        return;
    }
    
    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const user = await response.json();
        
        
        if (user) {
            setStatus({ type: 'success', message: 'Login successful! Redirecting to course page' });
            setUser(user);
            setIsAuthenticated(true);
            
            setTimeout(() => {
                navigate('/coursepage');
            }, 2000);
        } else {
            setStatus({ type: 'error', message: 'Invalid username or password.' });
        }
    } catch (error) {
        setStatus({ 
            type: 'error', 
            message: 'Error connecting to the server. Please try again later.' 
        });
        console.error('Error:', error);
    }
};

  return (
    <div>
      <Header />
      <div className='login-page'>
        <div className='login-form'>
          <h1>
            LMS Login
          </h1>
          {status.message && <DisplayStatus type={status.type} message={status.message} />}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                }}
                placeholder="Enter your email or username here"
              />
              {usernameError && <span className="error">{usernameError}</span>}
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                }}
                placeholder="Enter your password here"
              />
              {passwordError && <span className="error">{passwordError}</span>}
            </div>
            <button type='submit'>Login</button>
          </form>
          <div className='login-links'>
            <p>
                Forgot Password? <Link to='/forgotpassword'>Reset Password</Link>
            </p>
            <p>
              Don't have an account? <Link to='/signup'>Register</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Loginpage;


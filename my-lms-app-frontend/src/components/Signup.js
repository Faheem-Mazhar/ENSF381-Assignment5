import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Signup.css';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const validateSignupForm = () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
        
        hideMessage();
        
        // Validate username
        if (!validateUsername(username)) {
            return;
        }
        
        // Validate password
        if (!validatePassword(password)) {
            return;
        }
        
        // Validate confirm password
        if (password !== confirmPassword) {
            showMessage("Passwords do not match. Please try again.", "error");
            return;
        }
        
        // Validate email
        if (!validateEmail(email)) {
            return;
        }
        
        // If all validations pass, show success message and redirect
        showMessage("Signup successful! Redirecting to login page...", "success");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }
    
    // Function to validate username
    function validateUsername(username) {
        if (username.length < 3 || username.length > 20) {
            showMessage("Username must be between 3 and 20 characters long.", "error");
            return false;
        }
        
        if (!/^[a-zA-Z]/.test(username)) {
            showMessage("Username must start with a letter.", "error");
            return false;
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(username)) {
            showMessage("Username can only contain letters, numbers, hyphens (-), and underscores (_).", "error");
            return false;
        }
        
        return true;
    }
    
    // Function to validate password
    function validatePassword(password) {
        if (password.length < 8) {
            showMessage("Password must be at least 8 characters long.", "error");
            return false;
        }
        
        if (!/[A-Z]/.test(password)) {
            showMessage("Password must contain at least one uppercase letter.", "error");
            return false;
        }
        
        if (!/[a-z]/.test(password)) {
            showMessage("Password must contain at least one lowercase letter.", "error");
            return false;
        }

        if (!/[0-9]/.test(password)) {
            showMessage("Password must contain at least one number.", "error");
            return false;
        }
        
        if (!/[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~]/.test(password)) {
            showMessage("Password must contain at least one special character.", "error");
            return false;
        }
        
        if (/\s/.test(password)) {
            showMessage("Password cannot contain spaces.", "error");
            return false;
        }
        
        return true;
    }
    
    // Function to validate email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            return false;
        }
        
        if (/\s/.test(email)) {
            showMessage("Email cannot contain spaces.", "error");
            return false;
        }
        
        const domainRegex = /\.(com|net|io|org|edu|gov|co|info|biz)$/i;
        if (!domainRegex.test(email)) {
            showMessage("Email must contain a valid domain (e.g., .com, .net, .io).", "error");
            return false;
        }
        
        return true;
    }
    
    // Function to display message
    function showMessage(message, type) {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.className = 'message-box ' + type;
        messageBox.style.display = 'block';
    }
    
    // Function to hide message
    function hideMessage() {
        const messageBox = document.getElementById('messageBox');
        messageBox.style.display = 'none';
    }
        

  return (
    <div>
      <Header />
      <div className="signup-container">
        <div className="signup">
            <h2>Create a New Account</h2>
            <form className="signupForm">
            <label htmlFor="username">Username:</label>
            <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Enter a username (3-20 characters)"
            />
            
            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter a strong password (min 8 characters)"
            />
            
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirm your password"
            />
            
            <label htmlFor="email">Email:</label>
            <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email address"
            />
            </form>
            
            <button type="button" onClick={() => validateSignupForm()}>Sign up</button>
            <div id="messageBox" className="message-box"></div>
            
            <Link to="/login">Already have an account? Login</Link>
        </div>
        </div>
      <Footer />
    </div>
  );
}

export default Signup; 
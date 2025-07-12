import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    // You can implement saving to users.json or use mock signup logic
    const newUser = { email, password };
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/home');
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <img
          src="https://bardel.ca/wp-content/uploads/2017/10/Rick_and_Morty_Logo_and_Image.png"
          alt="Rick and Morty"
          style={{ maxWidth: '100%', marginBottom: '1rem' }}
        />
        <h2>Signup</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleSignup}>Create Account</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

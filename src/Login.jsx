import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css'; // Make sure your CSS is imported

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('/users.json');
    const users = await res.json();
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <img
          src="https://bardel.ca/wp-content/uploads/2017/10/Rick_and_Morty_Logo_and_Image.png"
          alt="Rick and Morty"
          style={{ maxWidth: '100%', marginBottom: '1rem' }}
        />
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>
        <p>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import './login.css';

function Register({ onRegisterSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const text = await response.text();
      if (text === 'Registration successful') {
        setSuccessMsg('✅ Registration successful! You can now login.');
        setError('');
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setError('❌ Username already exists');
        setSuccessMsg('');
      }
    } catch (err) {
      setError('❌ Error during registration');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        Register to Life Beats
        <img src="/beats.jpg" alt="Logo" className="login-logo" />
      </h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Create username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        {error && <p className="error-msg">{error}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}
        <p className="back-btn" onClick={onBack}>⬅ Back to Login</p>
      </form>
    </div>
  );
}

export default Register;

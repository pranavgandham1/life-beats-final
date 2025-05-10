import React, { useState, useEffect } from 'react';
import './login.css';

function Login({ onLogin, onNavigateRegister }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCaptcha = '';
    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(newCaptcha);
  };

  useEffect(() => {
    if (selectedRole === 'user') generateCaptcha();
  }, [selectedRole]);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setEnteredCaptcha('');
    setError('');
    if (role === 'user') generateCaptcha();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRole === 'admin') {
      
      if (username === 'admin' && password === '1234') {
        onLogin('admin');
      } else {
        setError('Invalid admin credentials 😢');
      }
      return;
    }

   
    if (enteredCaptcha !== captcha) {
      setError('❌ Incorrect captcha');
      generateCaptcha();
      setEnteredCaptcha('');
      return;
    }

   
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      if (text === 'Login successful') {
        onLogin('user');
      } else {
        setError('Invalid username or password 😢');
        generateCaptcha(); 
      }
    } catch (err) {
      setError('Error during login');
      generateCaptcha();
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">
        Login to Life Beats
        <img src="/beats.jpg" alt="Logo" className="login-logo" />
      </h2>

      {!selectedRole ? (
        <div className="role-buttons">
          <button onClick={() => handleRoleSelection('admin')} className="role-btn">Login as Admin</button>
          <button onClick={() => handleRoleSelection('user')} className="role-btn">Login as User</button>
          <p className="register-link" onClick={onNavigateRegister}>Don't have an account? Register</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <h3 className="login-subtitle">Login as {selectedRole.toUpperCase()}</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Captcha only for user login */}
          {selectedRole === 'user' && (
            <>
              <div className="captcha-box">
                <span className="captcha">{captcha}</span>
<span onClick={generateCaptcha} className="refresh-captcha" role="button" aria-label="Refresh captcha">🔄</span>

              </div>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit">Login</button>
          {error && <p className="error-msg">{error}</p>}
          <p className="back-btn" onClick={() => handleRoleSelection(null)}>⬅ Back to Role Selection</p>
        </form>
      )}
    </div>
  );
}

export default Login;

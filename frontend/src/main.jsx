// src/main.jsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import './style.css';

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 7000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);

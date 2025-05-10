// Add at the top
import React, { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import SongList from './components/SongList';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Register from './components/Register';
import VoiceRecorder from './components/VoiceRecorder';
import './style.css';
import './components/login.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // ✅
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('hasSeenSplash');
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isLoggedIn) fetchSongs();
  }, [isLoggedIn]);

  const fetchSongs = async () => {
    const res = await fetch('http://localhost:8080/songs');
    const data = await res.json();
    setSongs(data);
  };

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem('hasSeenSplash', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', userRole);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('hasSeenSplash');
  };

  if (showSplash) return <SplashScreen />;

  if (!isLoggedIn) {
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        onBack={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onNavigateRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="app">
      <div className="overlay">
        <div className="top-bar">
          <div className="app-header">
            <span role="img" aria-label="music">🎵</span> Life Beats
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {role === 'admin' && <UploadForm fetchSongs={fetchSongs} />}
        <img
          src="/beats.jpg"
          alt="Wanna see the list of songs...??"
          className="music-icon"
          onClick={() => setVisible(!visible)}
        />
        <p className="toggle-msg">🎧 Wanna see the list of songs? Click here 👆</p>

        {visible && (
          <>
            {/* ✅ Search bar */}
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <SongList
              songs={songs}
              fetchSongs={fetchSongs}
              isAdmin={role === 'admin'}
              searchTerm={searchTerm} // ✅ pass to SongList
            />
          </>
        )}

        {/* ✅ Voice recorder for user only */}
        {role === 'user' && <VoiceRecorder />}
      </div>
    </div>
  );
}

export default App;

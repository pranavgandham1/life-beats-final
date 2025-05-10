import React, { useState, useRef, useEffect } from 'react';
import './VoiceRecorder.css';

const DB_NAME = 'LifeBeatsRecordingsDB';
const DB_STORE = 'recordings';

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [showRecordings, setShowRecordings] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const openRequest = indexedDB.open(DB_NAME, 1);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      db.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: true });
    };

    openRequest.onsuccess = () => {
      loadRecordings();
    };

    openRequest.onerror = () => {
      console.error('Failed to open IndexedDB');
    };
  }, []);

  const loadRecordings = () => {
    const openRequest = indexedDB.open(DB_NAME, 1);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const getAll = store.getAll();

      getAll.onsuccess = () => {
        const loaded = getAll.result.map(rec => ({
          id: rec.id,
          url: URL.createObjectURL(rec.blob),
        }));
        setRecordings(loaded);
      };
    };
  };

  const saveRecording = (blob) => {
    const openRequest = indexedDB.open(DB_NAME, 1);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.add({ blob });

      tx.oncomplete = () => {
        loadRecordings();
      };
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        saveRecording(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access is required for recording');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const toggleRecordings = () => {
    setShowRecordings(prev => !prev);
  };

  return (
    <div className="voice-recorder">
      <h3>🎙️ Record Your Voice</h3>
      {!recording ? (
        <button className="record-btn" onClick={startRecording}>Start Recording</button>
      ) : (
        <button className="stop-btn" onClick={stopRecording}>Stop Recording</button>
      )}

      <div className="recordings-section">
        <div className="recordings-toggle" onClick={toggleRecordings}>
          Your Saved Recordings {showRecordings ? '▲' : '▼'}
        </div>

        {showRecordings && (
          <div className="recordings-list">
            {recordings.length === 0 && <p className="no-recordings">No recordings yet.</p>}
            {recordings.map(rec => (
              <audio key={rec.id} controls src={rec.url} className="audio-player" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceRecorder;

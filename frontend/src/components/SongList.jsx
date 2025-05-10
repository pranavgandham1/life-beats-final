import React from 'react';
import axios from 'axios';

function SongList({ songs, fetchSongs, isAdmin, searchTerm }) {
  const deleteSong = async (id) => {
    await axios.delete(`http://localhost:8080/songs/${id}`);
    fetchSongs();
  };

  
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="song-list">
      {filteredSongs.length === 0 && <p>No matching songs found.</p>}
      {filteredSongs.map((song) => (
        <div key={song.id} className="song-item">
          {song.imageFilename && (
            <img
              src={`http://localhost:8080/songs/image/${song.imageFilename}`}
              alt={song.title}
              className="song-image"
            />
          )}
          <div className="song-details">
            <span>{song.title} - {song.artist}</span>
            <audio controls src={`http://localhost:8080/songs/play/${song.filename}`} />
          </div>
          {isAdmin && (
            <button onClick={() => deleteSong(song.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default SongList;

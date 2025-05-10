import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ fetchSongs }) {
  const [form, setForm] = useState({
    title: '',
    artist: '',
    duration: '',
    file: null,
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('artist', form.artist);
    formData.append('duration', form.duration);
    formData.append('file', form.file);
    if (form.image) {
      formData.append('image', form.image);
    }

    await axios.post('http://localhost:8080/songs', formData);
    fetchSongs();
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <input type="text" name="artist" placeholder="Artist" onChange={handleChange} required />
      <input type="text" name="duration" placeholder="Duration" onChange={handleChange} required />
      <input type="file" name="file" accept="audio/*" onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;

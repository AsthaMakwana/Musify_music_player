import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../assets/css/admin/UploadSong.css'; // CSS for the form styling
import axiosInstance from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const UploadSong = () => {
  const { token } = useContext(AuthContext);
  const [songData, setSongData] = useState({
    title: '',
    artist: '',
    genre: '',
    releaseYear: '',
    image: null,
    audio: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSongData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setSongData(prevData => ({ ...prevData, [name]: e.target.files[0] }));
  };

  const uploadToCloudinary = async (file, resourceType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', resourceType === 'image' ? 'image_preset' : 'audio_preset'); // Replace with your Cloudinary upload preset
    console.log('Cloudinary Cloud Name:', import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME);

    const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      let audioUrl = null;

      if (songData.image) {
        imageUrl = await uploadToCloudinary(songData.image, 'image');
      }

      if (songData.audio) {
        audioUrl = await uploadToCloudinary(songData.audio, 'video'); // Cloudinary uses 'video' for audio files
      }

      const data = {
        title: songData.title,
        artist: songData.artist,
        genre: songData.genre,
        releaseYear: songData.releaseYear,
        imageUrl,
        audioUrl,
      };
      console.log(data);


      const response = await axiosInstance.post('/api/songs/add', {
        data
      },
        { headers: { "Authorization": `Bearer ${token}` } }
      );


      console.log(response);

      if (response.status === 201) {
        console.log('Song uploaded successfully!');
        setSongData({
          title: '',
          artist: '',
          genre: '',
          releaseYear: '',
          image: null,
          audio: null,
        });
        setError('');
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
        //add toast here
        toast.success('Song uploaded successfully!');
      } else {
        toast.error('Failed to upload the song. Please try again.');
        console.error('Error uploading song:', response.statusText);
      }
    } catch (error) {
      console.error('There was an error uploading the song!', error);
      setError('Failed to upload the song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="song-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={songData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Artist:</label>
          <input
            type="text"
            name="artist"
            value={songData.artist}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Genre:</label>
          <input
            type="text"
            name="genre"
            value={songData.genre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Release Year:</label>
          <input
            type="text"
            name="releaseYear"
            value={songData.releaseYear}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Image (optional):</label>
          <input
            type="file"
            name="image"
            accept=".png, .jpg, .jpeg, .webp"
            onChange={handleFileChange}
            ref={imageInputRef}
          />
        </div>

        <div className="form-group">
          <label>Audio File:</label>
          <input
            type="file"
            name="audio"
            accept=".mp3, .wav"
            onChange={handleFileChange}
            required
            ref={audioInputRef}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Song'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
      <ToastContainer />
    </>
  );
};

export default UploadSong;

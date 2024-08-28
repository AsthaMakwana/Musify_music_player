import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/client/Playlists.css';
import Image from '../../assets/images/playlist_image.jpg';
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axiosInstance.get('/api/playlists',
      { headers: { "Authorization": `Bearer ${token}` } }
    )
      .then(response => {
        setPlaylists(response.data);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
      });
  }, []);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div className="playlists-container">
      <h1>My Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        <div className="playlists-grid">
          {playlists.map(playlist => (
            <div
              key={playlist?._id}
              className="playlist-card"
              onClick={() => handlePlaylistClick(playlist?._id)}
            >
              <div className="playlist-image">
              <img src={Image} alt="Your Playlist" />
              </div>
              <div className="playlist-info">
                <h2>{playlist.name}</h2>
                {/* <p>{playlist.description || 'No description available'}</p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;

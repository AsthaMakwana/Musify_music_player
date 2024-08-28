import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/client/OnePlaylist.css';
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { PlaylistContext } from '../../context/PlaylistContext';

const OnePlaylist = () => {
  const { playlistId } = useParams(); // Get the playlistId from URL parameters
  // const [playlist, setPlaylist] = useState(null);
  const { playlist, setPlaylist } = useContext(PlaylistContext);
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Fetch playlist details and songs
    axiosInstance.get(`/api/playlists/${playlistId}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    )
      .then(response => {
        setPlaylist(response.data);
        setSongs(response.data.songs);
      })
      .catch(error => {
        console.error('Error fetching playlist:', error);
      });
  }, [playlistId]);

  const handleSongClick = (songId) => {
    navigate(`/player/${songId}`);
  };

  return (
    <div className="playlist-container">
      {playlist ? (
        <div className="playlist-info">
          <h1>{playlist.name}</h1>
          {playlist.imageUrl && (
            <img src={playlist.imageUrl} alt={playlist.name} className="playlist-image" />
          )}
          <p>{playlist.description || 'No description available'}</p>
        </div>
      ) : (
        <p>Loading playlist...</p>
      )}

      <div className="songs-list">
        <h2>Songs</h2>
        {songs.length === 0 ? (
          <p>No songs in this playlist.</p>
        ) : (
          <ul>
            {songs.map(song => (
              <li
                key={song._id}
                className="song-item"
                onClick={() => handleSongClick(song._id)}
              >
                {song.imageUrl && <img src={song.imageUrl} alt={song.title} />}
                <div className="song-info">
                  <p><strong>{song.title}</strong> by {song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OnePlaylist;

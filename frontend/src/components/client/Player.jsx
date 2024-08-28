import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Adjust the import based on your file structure
import '../../assets/css/client/Player.css';  // Import the CSS file
import { AuthContext } from '../../context/AuthContext';
import { PlaylistContext } from '../../context/PlaylistContext';

const Player = () => {
  const { id } = useParams(); // Get the song ID from the URL parameters
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume control
  const audioRef = useRef(null); // Reference to the audio element
  const { token } = useContext(AuthContext);
  const { playlist } = useContext(PlaylistContext);


  useEffect(() => {
    // Fetch the song details only once when the component mounts
    const fetchSong = async () => {
      try {
        const response = await axiosInstance.get(`/api/songs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSong(response.data);
        setIsPlaying(false);
      } catch (err) {
        console.error('Failed to fetch song.', err);
      }
    };

    if (id) {
      fetchSong();
    }
  }, [id, token]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && song) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = song.currentTime || 0;
      audioRef.current.pause();  // Ensure the song does not play until the user presses play
    }
  }, [song]);

  const playSong = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseSong = async () => {
    audioRef.current.pause();
    setIsPlaying(false);
    try {
      await axiosInstance.patch(`/api/songs/${id}/time`, {
        currentTime: audioRef.current.currentTime
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Failed to update song time.', err);
    }
  };

  const navigate = useNavigate();
  const skipNext = () => {
    playlist.songs.map((song, index) => {
      if (song._id === id) {
        if (index === playlist.songs.length - 1) {
          return navigate(`/player/${playlist.songs[0]._id}`);
        } else {
          return navigate(`/player/${playlist.songs[index + 1]._id}`);
        }
      }
    });
  };

  const skipPrev = () => {
    playlist.songs.map((song, index) => {
      if (song._id === id) {
        if (index === 0) {
          return navigate(`/player/${playlist.songs[playlist.songs.length - 1]._id}`);
        } else {
          return navigate(`/player/${playlist.songs[index - 1]._id}`);
        }
      }
    });
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value / 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div className="music-player-card-div">

      <div className="music-player-card">
        <div className="song-info">
          <img src={song.imageUrl} alt={song.title} className="song-image" />
          <div className="song-details">
            <span className="song-title">{song.title}</span>
            <span className="song-artist">{song.artist}</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100}
          onChange={handleSeek}
          className="seek-bar"
          style={{
            background: `linear-gradient(to right, #1db954 ${(currentTime / duration) * 100}%, #d3d3d3 0%)`
          }}
        />

        <div className="time-info">
          <span>
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </span>
          <span> / </span>
          <span>
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>


        <div className="controls">
          <button onClick={skipPrev}>
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3l0 41.7 0 41.7L459.5 440.6zM256 352l0-96 0-128 0-32c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-64z" /></svg>
          </button>
          <button onClick={isPlaying ? pauseSong : playSong}>
            <span style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "4px" }}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="32" width="20" viewBox="0 0 320 512">
                  <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="32" width="24" viewBox="0 0 384 512">
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                </svg>
              )}
            </span>
          </button>
          <button onClick={skipNext}>
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 160l0 96 0 128 0 32c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4l192-160C507.8 274.5 512 265.5 512 256s-4.2-18.5-11.5-24.6l-192-160c-9.5-7.9-22.8-9.7-34.1-4.4s-18.4 16.6-18.4 29l0 64z" /></svg>
          </button>
        </div>

        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="volume-bar"
          />
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default Player;

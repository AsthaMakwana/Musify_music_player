import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../assets/css/client/Home.css';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axiosInstance.get('/api/songs',
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                setSongs(response.data);
            } catch (err) {
                setError('Failed to fetch songs.');
            }
        };

        fetchSongs();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await axiosInstance.get('/api/playlists',
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            setPlaylists(response.data);
        } catch (err) {
            setError('Failed to fetch playlists.');
        }
    };
    useEffect(() => {
        fetchPlaylists();
    }, []);

    const openModal = (songId) => {
        setSelectedSong(songId);

        // Set the selected playlists where the song is already added
        const playlistsWithSong = playlists.filter(playlist =>
            playlist.songs.some(song => song._id === songId)
        ).map(playlist => playlist._id);

        setSelectedPlaylists(playlistsWithSong); // Pre-check playlists with the song
        setIsModalOpen(true);
    };

    const handleAddSongToPlaylists = async () => {
        try {
            for (let playlistId of selectedPlaylists) {
                // Find the playlist to check if the song already exists
                const selectedPlaylist = playlists.find(playlist => playlist._id === playlistId);

                // Only add the song if it doesn't already exist in the playlist
                if (!selectedPlaylist.songs.some(song => song._id === selectedSong)) {
                    await axiosInstance.post(`/api/playlists/add-song`, { playlistId, songId: selectedSong },
                        { headers: { "Authorization": `Bearer ${token}` } }
                    );
                }
            }
            setSelectedPlaylists([]);
            setSelectedSong(null);
            closeModal();
            setError('');
        } catch (err) {
            setError('Failed to add song to playlists.');
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlaylists([]);
        setNewPlaylistName('');
    };

    const togglePlaylistSelection = (playlistId) => {
        if (selectedPlaylists.includes(playlistId)) {
            setSelectedPlaylists(selectedPlaylists.filter(id => id !== playlistId));
        } else {
            setSelectedPlaylists([...selectedPlaylists, playlistId]);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            setError('Playlist name cannot be empty.');
            return;
        }
        try {
            const response = await axiosInstance.post('/api/playlists/create', { name: newPlaylistName },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            fetchPlaylists();
            setNewPlaylistName('');
        } catch (err) {
            setError('Failed to create playlist.');
        }
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Songs</h1>
            {error && <div className="error-message">{error}</div>}

            <div className="songs-grid">
                {songs.map((song) => (
                    <div key={song._id} className="song-card">
                        <img src={song.imageUrl} alt={song.title} className="song-image" />
                        <h3 className="song-title">{song.title}</h3>
                        <button className="add-button" onClick={() => openModal(song._id)}>Add</button>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Select Playlists</h2>
                <div className="playlist-options">
                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="playlist-option">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedPlaylists.includes(playlist._id)}
                                    onChange={() => togglePlaylistSelection(playlist._id)}
                                />
                                {playlist.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="create-playlist-section">
                    <h3>Create New Playlist</h3>
                    <div className="create-playlist-button-div">
                        <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="Enter playlist name"
                            className="playlist-input"
                        />
                        <button className="create-playlist-button" onClick={handleCreatePlaylist}>Create</button>
                    </div>
                </div>

                <button className="done-button" onClick={handleAddSongToPlaylists}>Done</button>
                <button className="close-button" onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Home;

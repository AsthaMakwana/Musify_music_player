import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axiosInstance from '../utils/axiosInstance';

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlist, setPlaylist] = useState({});
    const { token } = useContext(AuthContext);

    // const fetchPlaylistByID = async () => {
    //     try {
    //         const response = await axiosInstance.get('/api/playlists', {
    //         }, { headers: { "Authorization": `Bearer ${token}` } }
    //         );
    //         setPlaylist(response.data);
    //     } catch (error) {
    //         console.error('Error fetching playlists:', error.response ? error.response.data : error.message);
    //     }
    // };

    const addPlaylist = async (name, songs) => {
        try {
            const response = await axiosInstance.post(
                '/api/playlists',
                { name, songs },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            setPlaylist((prevPlaylists) => [...prevPlaylists, response.data]);
        } catch (error) {
            console.error('Error adding playlist:', error.response ? error.response.data : error.message);
        }
    };

    const removeSongFromPlaylist = async (playlistId, songId) => {
        try {
            await axiosInstance.post(
                `/api/playlists/${playlistId}/remove`,
                { songId },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            setPlaylist((prevPlaylists) =>
                prevPlaylists.map((playlist) =>
                    playlist._id === playlistId
                        ? { ...playlist, songs: playlist.songs.filter((song) => song._id !== songId) }
                        : playlist
                )
            );
        } catch (error) {
            console.error('Error removing song from playlist:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <PlaylistContext.Provider value={{ playlist, setPlaylist, addPlaylist, removeSongFromPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
};
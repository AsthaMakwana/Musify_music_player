# Musify - Music Player Web Application

## Overview

Musify is a full-stack music player web application built with the MERN stack (MongoDB, Express.js, React, Node.js), incorporating user authentication, playlist management. Users can upload and manage their music, create and view playlists, and enjoy a modern, responsive music player.

## Features

1. User Authentication: Secure login and logout functionality.
2. Music Player: Play, pause, skip, and resume music with a user-friendly interface.
3. Playlists: Create, view, and manage playlists with support for adding and removing songs.
4. Responsive Design: Optimized for various screen sizes and devices.
5. Error Handling: Graceful handling of errors and edge cases.

## Getting Started
### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm
- MongoDB (or access to a MongoDB database)
- Cloudinary account (for media storage)

## Installation

1. Clone the Repository

```
git clone https://github.com/AsthaMakwana/music-player.git
cd Musify
```

2. Install Backend Dependencies

Navigate to the server directory and install the necessary dependencies:

```
cd server
npm install
```

3. Install Frontend Dependencies

Navigate to the client directory and install the necessary dependencies:

```
cd ../client
npm install
```

4. Configure Environment Variables

Create a .env file in both the server and client directories and add the following environment variables:

Server (Backend)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Client (Frontend)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Running the Project

1. Start the Backend Server

```
cd server
npm start
```

This will start the backend server on http://localhost:5000.

2. Start the Frontend Development Server

```
cd ../client
npm run dev
```

## Usage
- Login/Signup: Access the login/signup page to authenticate or register a new user.
- Home Page: Browse and search for songs and playlists.
- Playlists: View and manage your playlists. Click on a playlist to view its details and songs.
- Player: Click on a song to play it. Use the music player controls to play, pause, skip, or adjust the volume.
- Admin: Only admins are allowed to upload songs and not users


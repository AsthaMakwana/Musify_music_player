import './App.css'
import Player from './components/client/Player'
import { Routes, Route, Outlet } from 'react-router-dom'
import UploadSong from './components/admin/UploadSong.jsx'
import Playlists from './components/client/Playlists.jsx'
import Navbar from './components/client/Navbar.jsx'
import Home from './components/client/Home.jsx'
import LoginSignup from './components/client/LoginSignup.jsx'
import { Navigate } from 'react-router-dom';
import OnePlaylist from './components/client/OnePlaylist.jsx'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' />
  );
}

const Layout = () => {
  return (
    <div className='main-layout'>
      <Navbar />
      <Outlet />
    </div>
  )
}

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route exact index element={<ProtectedRoute> <Home /></ProtectedRoute>} />
          {/* <Route path='/song' element={<Player />} /> */}
          {/* <Route path='/player/:id' element={<Player />} /> */}
          <Route exact path='/admin' element={<ProtectedRoute><UploadSong /></ProtectedRoute>} />
          <Route exact path='/player/:id' element={<ProtectedRoute><Player /></ProtectedRoute>} />
          <Route exact path='/playlists' element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
          <Route exact path='/playlist/:playlistId' element={<ProtectedRoute><OnePlaylist /></ProtectedRoute>} />
        </Route>
        <Route exact path='/login' element={<LoginSignup />} />
        <Route exact path='*' element={<h1>404 Not Found</h1>} />

      </Routes>
    </>
  )
}

export default App

import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/client/Navbar.css';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Music Player</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" activeclassname="active">
            Songs
          </NavLink>
        </li>
        <li>
          <NavLink to="/playlists" activeclassname="active">
            Playlists
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" activeclassname="active">
            Admin
          </NavLink>
        </li>
        <li>
          {
            token ? (
              // <NavLink to="/logout" activeclassname="active">
              <span style={{ color: "white", cursor: "pointer" }} onClick={() => {
                logout();
              }}>
                Logout
              </span>
            ) : (
              <NavLink to="/login" activeclassname="active">
                login
              </NavLink>
            )
          }

        </li>

      </ul>
    </nav>
  );
};

export default Navbar;

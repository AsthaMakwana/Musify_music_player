import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
        // If there's no token, redirect to login
        return <Navigate to="/"/>;
    }

    // If the user is authenticated, render the children (the protected component)
    return children;
};

export default ProtectedRoute;

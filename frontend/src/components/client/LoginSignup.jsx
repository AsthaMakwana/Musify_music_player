import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/client/LoginSignup.css';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


const LoginSignup = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and signup
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);


  // Handle login form input change
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle signup form input change
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.token) {
        await login(response.data.token);
        setError('');
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000);

      }
    } catch (err) {
      console.log(err);

      setError('Login failed. Please check your credentials.');
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/signup', {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });

      if (response.status === 201) {
        const loginResponse = await axiosInstance.post('/api/auth/login', {
          email: signupData.email,
          password: signupData.password,
        });

        if (loginResponse.data.token) {
          await login(loginResponse.data.token);
          setError('');
          toast.success('Signup successful!');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className={`login form ${isLoginMode ? 'active' : ''}`}>
        <header>Login</header>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <a href="#">Forgot password?</a>
          {error && <div className="error">{error}</div>}
          <input type="submit" className="button" value="Login" />
        </form>
        <div className="signup">
          <span className="signup">
            Don't have an account?
            <label onClick={() => setIsLoginMode(false)}>Signup</label>
          </span>
        </div>
      </div>

      <div className={`registration form ${!isLoginMode ? 'active' : ''}`}>
        <header>Signup</header>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={signupData.username}
            onChange={handleSignupChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={signupData.email}
            onChange={handleSignupChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={signupData.password}
            onChange={handleSignupChange}
            required
          />
          {error && <div className="error">{error}</div>}
          <input type="submit" className="button" value="Signup" />
        </form>
        <div className="signup">
          <span className="signup">
            Already have an account?
            <label onClick={() => setIsLoginMode(true)}>Login</label>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignup;

// import React, { useState } from 'react';
// import './Registration.css'; // Make sure to have the corresponding CSS file

// const Registration = () => {
//   const [isChecked, setIsChecked] = useState(false);

//   return (
//     <div className="container">
//       <input
//         type="checkbox"
//         id="check"
//         checked={isChecked}
//         onChange={() => setIsChecked(!isChecked)}
//       />
//       <div className={`login form ${!isChecked ? 'active' : ''}`}>
//         <header>Login</header>
//         <form action="#">
//           <input type="text" placeholder="Enter your email" />
//           <input type="password" placeholder="Enter your password" />
//           <a href="#">Forgot password?</a>
//           <input type="button" className="button" value="Login" />
//         </form>
//         <div className="signup">
//           <span className="signup">
//             Don't have an account?
//             <label htmlFor="check" onClick={() => setIsChecked(true)}>
//               Signup
//             </label>
//           </span>
//         </div>
//       </div>
//       <div className={`registration form ${isChecked ? 'active' : ''}`}>
//         <header>Signup</header>
//         <form action="#">
//           <input type="text" placeholder="Enter your username" />
//           <input type="text" placeholder="Enter your email" />
//           <input type="password" placeholder="Create a password" />
//           {/* Uncomment the next line if you want to add confirm password functionality */}
//           {/* <input type="password" placeholder="Confirm your password" /> */}
//           <input type="button" className="button" value="Signup" />
//         </form>
//         <div className="signup">
//           <span className="signup">
//             Already have an account?
//             <label htmlFor="check" onClick={() => setIsChecked(false)}>
//               Login
//             </label>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Registration;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();  // Initialize the useNavigate hook

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const handleLoginSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Login successful:', data);
                navigate('/song');
                // Handle login success (e.g., store token, redirect user, etc.)
            } else {
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleSignupSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Signup successful:', data);
                localStorage.setItem('token', data.token);
                navigate('/song');
                // Handle signup success (e.g., show a message, switch to login view, etc.)
            } else {
                console.error('Signup failed:', data.error);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="container">
            <input
                type="checkbox"
                id="check"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
            <div className={`login form ${!isChecked ? 'active' : ''}`}>
                <header>Login</header>
                <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}>
                    <input
                        type="text"
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
                    <button type="submit" className="button">Login</button>
                </form>
                <div className="signup">
                    <span className="signup">
                        Don't have an account?
                        <label htmlFor="check" onClick={() => setIsChecked(true)}>
                            Signup
                        </label>
                    </span>
                </div>
            </div>
            <div className={`registration form ${isChecked ? 'active' : ''}`}>
                <header>Signup</header>
                <form onSubmit={(e) => { e.preventDefault(); handleSignupSubmit(); }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={signupData.username}
                        onChange={handleSignupChange}
                        required
                    />
                    <input
                        type="text"
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
                    <button type="submit" className="button">Signup</button>
                </form>
                <div className="signup">
                    <span className="signup">
                        Already have an account?
                        <label htmlFor="check" onClick={() => setIsChecked(false)}>
                            Login
                        </label>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Registration;



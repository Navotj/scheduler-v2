import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful', data);
                localStorage.setItem('token', data.token); // Normally, you'd handle a token here
                onLoginSuccess(username);
                navigate('/profile');
            } else {
                console.error('Login failed');
                alert('Login failed, please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred, please try again later.');
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                console.log('Sign-up successful');
                navigate('/login');
            } else {
                console.error('Sign-up failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin}>Login</button>
            <p className="forgot-password" onClick={() => alert('Forgot your password? Functionality coming soon!')}>
                Forgot your password?
            </p>
            <p className="sign-up" onClick={handleSignUp}>
                Sign up
            </p>
        </div>
    );
};

export default Login;

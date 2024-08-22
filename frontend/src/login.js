import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Use useNavigate hook

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful', data);
                localStorage.setItem('token', data.token);
                onLoginSuccess(username);  // Pass the username to the parent component
                navigate('/mySchedule');  // Navigate to mySchedule after login
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
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                console.log('Sign-up successful');
                navigate('/login');  // Redirect to login after successful sign-up
            } else {
                console.error('Sign-up failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="login-box">
                <h2>Login</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleLogin}>Login</button>
                <p style={{ cursor: 'pointer', fontSize: '0.9em' }} onClick={() => alert('Forgot your password? Functionality coming soon!')}>
                    Forgot your password?
                </p>
                <p onClick={handleSignUp} style={{ cursor: 'pointer', fontSize: '0.9em' }}>
                    Sign up
                </p>
            </div>
        </div>
    );
};

export default Login;

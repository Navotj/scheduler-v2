import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Login from './login';
import CreateGame from './CreateGame';
import FindGame from './FindGame';
import MyGames from './MyGames';
import MySchedule from './MySchedule';
import Profile from './Profile';
import './styles.css';

const Main = () => {
    const [username, setUsername] = useState(''); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = (user) => {
        setUsername(user);
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <Sidebar isLoggedIn={isLoggedIn} />
            <div id="main-content">
                <div className="form-container">
                    <Routes>
                        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/profile" element={<Profile username={username} />} />
                        <Route path="/mySchedule" element={<MySchedule username={username} />} />
                        <Route path="/createGame" element={<CreateGame username={username} />} />
                        <Route path="/findGame" element={<FindGame username={username} />} />
                        <Route path="/myGames" element={<MyGames username={username} />} />
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/profile" : "/login"} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Main;

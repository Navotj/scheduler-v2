import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import CreateGame from './gamecreation/pages/CreateGame';
import FindGame from './components/FindGame';
import MyGames from './components/MyGames';
import MySchedule from './scheduling/pages/SchedulePage';
import Profile from './components/Profile';
import WeekTemplate from './scheduling/pages/WeekTemplatePage';
import GroupsPage from './groupavailability/pages/GroupsPage';
import './styles/main.css';

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
                        {isLoggedIn ? (
                            <>
                                <Route path="/profile" element={<Profile username={username} />} />
                                <Route path="/mySchedule" element={<MySchedule username={username} />} />
                                <Route path="/createGame" element={<CreateGame username={username} />} />
                                <Route path="/findGame" element={<FindGame username={username} />} />
                                <Route path="/myGames" element={<MyGames username={username} />} />
                                <Route path="/WeekTemplate" element={<WeekTemplate username={username} />} />
                                <Route path="/GroupsPage" element={<GroupsPage username={username} />} />
                                <Route path="*" element={<Navigate to="/profile" />} />
                            </>
                        ) : (
                            <Route path="*" element={<Navigate to="/login" />} />
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Main;

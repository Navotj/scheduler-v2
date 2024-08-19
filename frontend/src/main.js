import React, { useState } from 'react';
import WeekPicker from './WeekPicker';
import AvailabilityPicker from './AvailabilityPicker';
import Sidebar from './sidebar';
import Login from './login';
import CreateGame from './CreateGame';
import FindGame from './FindGame';
import MyGames from './MyGames';
import './styles.css';

const Main = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activePage, setActivePage] = useState('login');
    const [username, setUsername] = useState(''); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [availability, setAvailability] = useState(null);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const navigateTo = (page) => {
        if (!isLoggedIn && ['mySchedule', 'createGame', 'myGames'].includes(page)) {
            setActivePage('login');
        } else {
            setActivePage(page);
        }
    };

    const handleLoginSuccess = (user) => {
        setUsername(user);
        setIsLoggedIn(true); 
        navigateTo('profile'); 
    };

    const handleWeekSelect = (week) => {
        console.log('Week selected:', week);
        setSelectedWeek(week);
        fetchAvailability(username, week.weekNumber);
    };

    const fetchAvailability = async (username, weekNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/availability/${username}/${weekNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAvailability(data);
            } else {
                console.error('Failed to fetch availability');
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleAvailabilitySubmit = async (availabilityData) => {
        try {
            const response = await fetch('http://localhost:5000/save', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    week: selectedWeek.weekNumber,
                    availability: availabilityData,
                }),
            });

            if (response.ok) {
                console.log('Availability saved successfully');
            } else {
                console.error('Failed to save availability');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Sidebar 
                sidebarCollapsed={sidebarCollapsed}
                navigateTo={navigateTo}
                toggleSidebar={toggleSidebar}
                isLoggedIn={isLoggedIn} 
            />

            <div id="main-content" className={sidebarCollapsed ? 'collapsed' : ''}>
                {activePage === 'login' && (
                    <Login navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />
                )}
                {activePage === 'profile' && (
                    <div id="profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <h1>{username}</h1>
                    </div>
                )}
                {activePage === 'mySchedule' && (
                    <div className="form-container">
                        <div id="mySchedule">
                            <div id="availabilityContainer" style={{display: 'flex', flexDirection: 'row'}}>
                                <div id="availabilityPickerContainer" style={{flexGrow: 1}}>
                                    {selectedWeek && (
                                        <AvailabilityPicker
                                            username={username}
                                            week={selectedWeek}
                                            availability={availability}
                                            onAvailabilitySubmit={handleAvailabilitySubmit}
                                        />
                                    )}
                                </div>
                                <div id="weeksList" className="week-buttons">
                                    <WeekPicker onWeekSelect={handleWeekSelect} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activePage === 'createGame' && (
                    <CreateGame username={username} />
                )}
                {activePage === 'findGame' && (
                    <FindGame username={username} />
                )}
                {activePage === 'myGames' && (
                    <MyGames username={username} />
                )}
                {/* Other pages remain for future implementation */}
            </div>
        </div>
    );
};

export default Main;

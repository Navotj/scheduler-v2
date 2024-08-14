import React, { useState } from 'react';
import WeekPicker from './WeekPicker';
import AvailabilityPicker from './AvailabilityPicker';
import './styles.css';

const Main = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activePage, setActivePage] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [availability, setAvailability] = useState(null);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const navigateTo = (page) => {
        setActivePage(page);
    };

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
                navigateTo('mySchedule');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
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
                navigateTo('login');  // Redirect to login after successful sign-up
            } else {
                console.error('Sign-up failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleWeekSelect = (week) => {
        console.log('Week selected:', week);
        setSelectedWeek(week);
        fetchAvailability(username, week.weekNumber);
    };

    const fetchAvailability = async (username, weekNumber) => {
        console.log('Fetching availability for:', username, weekNumber);
        try {
            const response = await fetch(`http://localhost:5000/availability/${username}/${weekNumber}`);
            const data = await response.json();
            console.log('Fetched data:', data);
            setAvailability(data);
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
            <div id="sidebar" className={sidebarCollapsed ? 'collapsed' : ''}>
                <div className="toggle-btn" onClick={toggleSidebar}>
                    &#9776;
                </div>
                <ul>
                    <li onClick={() => navigateTo('login')}>
                        <a href="#">{sidebarCollapsed ? '1' : 'Login'}</a>
                    </li>
                    <li onClick={() => navigateTo('createGame')}>
                        <a href="#">{sidebarCollapsed ? '3' : 'Create Game'}</a>
                    </li>
                    <li onClick={() => navigateTo('findGame')}>
                        <a href="#">{sidebarCollapsed ? '4' : 'Find Game'}</a>
                    </li>
                    <li onClick={() => navigateTo('myGames')}>
                        <a href="#">{sidebarCollapsed ? '5' : 'My Games'}</a>
                    </li>
                    <li onClick={() => navigateTo('mySchedule')}>
                        <a href="#">{sidebarCollapsed ? '6' : 'My Schedule'}</a>
                    </li>
                    <li onClick={() => navigateTo('messages')}>
                        <a href="#">{sidebarCollapsed ? '7' : 'Messages'}</a>
                    </li>
                    <li onClick={() => navigateTo('settings')}>
                        <a href="#">{sidebarCollapsed ? '8' : 'Settings'}</a>
                    </li>
                </ul>
            </div>

            <div id="main-content" className={sidebarCollapsed ? 'collapsed' : ''}>
                {activePage === 'login' && (
                    <div id="login">
                        <h2>Login</h2>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button onClick={handleLogin}>Login</button>
                        <p style={{cursor: 'pointer', fontSize: '0.9em'}} onClick={() => alert('Forgot your password? Functionality coming soon!')}>Forgot your password?</p>
                        <p onClick={() => navigateTo('signUp')} style={{cursor: 'pointer', fontSize: '0.9em'}}>Sign up</p>
                    </div>
                )}
                {activePage === 'signUp' && (
                    <div id="signUp">
                        <h2>Sign Up</h2>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <button onClick={handleSignUp}>Sign Up</button>
                        <p onClick={() => navigateTo('login')} style={{cursor: 'pointer', fontSize: '0.9em'}}>Back to login</p>
                    </div>
                )}
                {activePage === 'mySchedule' && (
                    <div id="mySchedule">
                        <div id="availabilityContainer">
                            <div id="availabilityPickerContainer">
                                {selectedWeek && (
                                    <AvailabilityPicker
                                        username={username}
                                        week={selectedWeek}
                                        availability={availability}
                                        onAvailabilitySubmit={handleAvailabilitySubmit}
                                    />
                                )}
                            </div>
                        </div>
                        <div id="actionButtons">
                            <button>+</button>
                            <button>-</button>
                            <button>Save</button>
                            <button>Clear All</button>
                        </div>
                        <div id="weeksList" className="week-buttons">
                            <WeekPicker username={username} onWeekSelect={handleWeekSelect} />
                        </div>
                    </div>
                )}
                {/* Other pages remain empty for now */}
            </div>
        </div>
    );
};

export default Main;

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isLoggedIn }) => {
    return (
        <div id="sidebar">
            <ul>
                <li>
                    <NavLink
                        to={isLoggedIn ? "/profile" : "/login"}
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        {isLoggedIn ? "Profile" : "Login"}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mySchedule"
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        My Schedule
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/defaultWeek"
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        Default Week
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/createGame"
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        Create Game
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/myGames"
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        My Games
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/findGame"
                        className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
                    >
                        Find Game
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

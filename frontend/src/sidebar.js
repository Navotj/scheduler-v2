import React from 'react';

const Sidebar = ({ sidebarCollapsed, navigateTo, toggleSidebar, isLoggedIn }) => {
    return (
        <div id="sidebar" className={sidebarCollapsed ? 'collapsed' : ''}>
            <div className="toggle-btn" onClick={toggleSidebar}>
                ☰
            </div>
            <ul>
                {isLoggedIn ? (
                    <>
                        <li onClick={() => navigateTo('mySchedule')}>
                            My Schedule
                        </li>
                        <li onClick={() => navigateTo('createGame')}>
                            Create Game
                        </li>
                        <li onClick={() => navigateTo('myGames')}>
                            My Games
                        </li>
                    </>
                ) : (
                    <li onClick={() => navigateTo('login')}>
                        Login
                    </li>
                )}
                <li onClick={() => navigateTo('findGame')}>
                    Find Game
                </li>
                {/* Keep other sidebar items here for future implementation */}
            </ul>
        </div>
    );
};

export default Sidebar;

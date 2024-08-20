import React from 'react';

const Sidebar = ({ navigateTo, currentPage, isLoggedIn }) => {
    return (
        <div id="sidebar">
            <ul>
                {isLoggedIn ? (
                    <>
                        <li className={currentPage === 'mySchedule' ? 'active' : ''} onClick={() => navigateTo('mySchedule')}>
                            My Schedule
                        </li>
                        <li className={currentPage === 'createGame' ? 'active' : ''} onClick={() => navigateTo('createGame')}>
                            Create Game
                        </li>
                        <li className={currentPage === 'myGames' ? 'active' : ''} onClick={() => navigateTo('myGames')}>
                            My Games
                        </li>
                    </>
                ) : (
                    <li className={currentPage === 'login' ? 'active' : ''} onClick={() => navigateTo('login')}>
                        Login
                    </li>
                )}
                <li className={currentPage === 'findGame' ? 'active' : ''} onClick={() => navigateTo('findGame')}>
                    Find Game
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

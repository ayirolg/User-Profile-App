import React from "react";
import {NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar=()=>{

    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="app-sidebar">
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <NavLink to='/dashboard' className={({isActive})=>
                        'nav-link ' + (isActive ? 'active text-white fw-bold' : 'text-white') } style={{textDecoration: 'none'}}>Dashboard</NavLink>
                </li>
                {currentUser?.role !== 'Customer' && (
                    <>
                            <li className="nav-item mb-2">
                            <NavLink to="/users" className={({ isActive }) =>
                            'nav-link ' + (isActive ? 'active text-white fw-bold' : 'text-white')}
                            style={{ textDecoration: 'none' }}>
                            User Management
                            </NavLink>
                        </li>
                        <li className="nav-item mb-2">
                            <NavLink to="/user-data" className={({ isActive }) =>
                            'nav-link ' + (isActive ? 'active text-white fw-bold' : 'text-white')}
                            style={{ textDecoration: 'none' }}>
                            User Data
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";


const Header =() =>{
    const user = useSelector((state) =>state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout =() =>{
        dispatch(logoutUser());
        navigate('/');
    };
    const toggleDropdown =() => {
        setShowDropdown(!showDropdown);
    };

    const isPrivileged = user?.role==='Admin' || user?.role==='Manager';
    
    return (
        <div className="app-header">
            <div>
                <h3 className="text-light">Welcome, {user?.firstName}</h3>
                <h5 className="text-light">{user?.role}</h5> 
            </div>          
            <div className="d-flex align-items-center position-relative">
                    {isPrivileged && (
                    <div className="position-relative me-3">
                        <FaUserCircle
                        size={30}
                        color="white"
                        style={{ cursor: "pointer" }}
                        onClick={toggleDropdown}
                        />

                        {showDropdown && (
                        <div className="dropdown-menu show p-1" style={{ right: 0, left: 'auto', top: '2.5rem', position: 'absolute' }}>
                            <p className="mb-1"><strong>Name:</strong> {user.firstName}</p>
                            <p className="mb-0"><strong>Role:</strong> {user.role}</p>
                        </div>
                        )}
                    </div>
                    )}
                    <button className="btn btn-primary" onClick={handleLogout}>SignOut</button>
            </div>        
            </div>
    );
};

export default Header;
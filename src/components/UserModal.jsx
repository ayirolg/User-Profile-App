import React, { useState } from "react";
import {Modal, Button} from 'react-bootstrap';
import UserForm from "./UserForm";

const UserModal = ({ show, user, onClose, onSave, onDelete, currentUser}) => {
    if(!user) return null;

    const isAdmin = currentUser.role === 'Admin';
    const isManager = currentUser.role === 'Manager';
    const [showEdit, setShowEdit] = useState(false);
    
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Contact No:</strong> {user.contactNo}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p>
                   <strong>Status:</strong>{' '}
                    <span
                        className={`badge ${
                        user.status === 'Active' ? 'bg-success' : 'bg-danger'
                        }`}
                    >
                        {user.status}
                    </span> 
                </p>
            </Modal.Body>
            <Modal.Footer>
                {(isAdmin || isManager) && (
                    <Button variant="warning" onClick={() => setShowEdit(true)}>
                        Edit
                    </Button>
                )}
                {isAdmin && (
                    <Button variant="danger" onClick={() => {
                        onDelete(user.id);
                        onClose(); 
                    }}>
                        Delete
                    </Button>
                )}
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <UserForm
                    show={showEdit}
                    user={user}
                    onClose={() => {
                        setShowEdit(false);
                        onClose(); 
                    }}
                    onSave={(updatedUser) => {
                        onSave(updatedUser);  
                    }}
                    currentUser={currentUser}
                />
            </Modal.Footer>
        </Modal> 
    );
};

export default UserModal;
// src/components/CustomerDashboard.jsx
import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';

const CustomerDashboard = ({setLoading}) => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="mt-4">
      <h5>Hello, {currentUser.firstName} 👋</h5>
      <p className="text-muted">Here's a summary of your profile details:</p>

      <div className="card shadow-sm mt-3">
        <div className="card-body">
          <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
          <p><strong>Contact No:</strong> {currentUser.contactNo}</p>
          <p><strong>Address:</strong> {currentUser.address}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge ${currentUser.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{currentUser.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
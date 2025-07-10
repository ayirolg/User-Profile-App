
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/sidebar';
import UserData from '../components/UserData';
import { useSelector } from 'react-redux';
const UserDataPage = () => {
  const [users, setUser] = useState([]);
  const {currentUser} =useSelector ((state) => state.user);


  const columns = [
    { label: 'ID', key: 'id', type:'number'},
    { label: 'First Name', key: 'firstName' , type:'string'},
    { label: 'Last Name', key: 'lastName', type:'string' },
    { label: 'Email', key: 'email', type:'string' },
    { label: 'Role', key: 'role' , type:'string'},
    { label: 'Status', key: 'status' , type:'string'},
    { label: 'Contact No', key: 'contactNo' , type:'number'},
    { label: 'Address', key: 'address' , type:'string'},
  ];

  const API_URL = '/api/users';

  useEffect(() => {
          fetchUsers(); 
      }, []);

  const fetchUsers = async () => {
    try {
        const res = await axios.get(`${API_URL}`);
        let data = res.data;

        if(currentUser.role === 'Manager') {
            data = data.filter ((u)=>u.role === 'Customer');
        } else if (currentUser.role === 'Customer') {
            data = data.filter ((u) => u.email === currentUser.email);
        }

        setUser(data);
        console.log(data);
    } catch (err) {
        console.error('Error fetching users: ', err);
    }
};

console.log("users: ",users);
  return (
    <div className="d-flex flex-column vh-100">
      <Header/>
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <div className="flex-grow-1 overflow-auto">
          <UserData 
            data={users} 
            columns={columns} 
            title="User Management" 
          />
        </div>
      </div>
    </div>
  );
};

export default UserDataPage;

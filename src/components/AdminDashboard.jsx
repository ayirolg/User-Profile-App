import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from './StatCard';


const API_URL = '/api/users';

const AdminDashboard =({ setLoading }) =>{
    const [users, setUsers] = useState([]);

    useEffect (() => {
        fetchUsers();
    },[]);


    const fetchUsers = async () => {
        try {
            const res = await axios.get(API_URL);
            setUsers(res.data);
        }
        catch(err) {
            console.error('Failed to fetch users: ',err);
        } finally {
            setLoading(false);
        }
    };

    const totalUsers = users.length;
    const managers = users.filter(u => u.role === 'Manager').length;
    const customers = users.filter(u=> u.role ==='Customer').length;
    const inactive = users.filter(u => u.status.toLowerCase() ==='inactive').length;

    return (
        <div className="d-flex justify-content-around flex-wrap mt-4 gap-3">
            <StatCard title="Total Users" value={totalUsers} bg="primary" />
            <StatCard title="Managers" value={managers} bg="warning" />
            <StatCard title="Customers" value={customers} bg="success" />
            <StatCard title="Inactive Users" value={inactive} bg="danger" />
        </div>
    );
};

export default AdminDashboard;
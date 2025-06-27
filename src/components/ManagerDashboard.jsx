// src/components/ManagerDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from './StatCard';

const API_URL = '/api/users';

const ManagerDashboard = ({setLoading}) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_URL);
      const allUsers = res.data;
      const onlyCustomers = allUsers.filter(u => u.role === 'Customer');
      setCustomers(onlyCustomers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status.toLowerCase() === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status.toLowerCase() === 'inactive').length;

  return (
    <div className="row mt-4">
      <StatCard title="Total Customers" value={totalCustomers} bg="primary" />
      <StatCard title="Active Customers" value={activeCustomers} bg="success" />
      <StatCard title="Inactive Customers" value={inactiveCustomers} bg="warning" />
    </div>
  );
};

export default ManagerDashboard;
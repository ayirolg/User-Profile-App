import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import AdminDashboard from "../components/AdminDashboard";
import ManagerDashboard from "../components/ManagerDashboard";
import CustomerDashboard from "../components/CustomerDashboard";
import { useSelector } from "react-redux";

const DashBoard =() =>{
    const {currentUser}= useSelector((state) => state.user);
    const [loading,setLoading] =useState(true);

    return (
        <>
        <Header />
        <div className="d-flex min-vh-100">
          <Sidebar />
          <div className="flex-grow-1 p-4">
              <h3>Dashboard</h3>
        
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading Dashboard...</p>
                </div>
            )}    

                {currentUser.role === 'Admin' && (
                     <AdminDashboard setLoading={setLoading}/>
                )}
                {currentUser.role === "Manager" && (
                    <ManagerDashboard setLoading={setLoading} />
                )}
                {currentUser.role === "Customer" && (
                    <CustomerDashboard setLoading={setLoading} />
                )}
            </div>
         </div>
        </>
     );
};

export default DashBoard;
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/sidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserModal from '../components/UserModal';
import DeleteConfirmModal from '../components/ConfirmModal';
import ReactPaginate from 'react-paginate';

const UsersList = () => {
    const {currentUser} =useSelector ((state) => state.user);
    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    const API_URL = '/api/users';

    const isAdmin = currentUser.role === 'Admin';
    const isManager = currentUser.role === 'Manager';


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() => {
        fetchUsers(); 
    }, []);

    useEffect (()=> {
        applyFilters();
    }, [user, search, statusFilter, sortAsc]);

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
        } catch (err) {
            console.error('Error fetching users: ', err);
        }
    };

    const applyFilters = () => {
        let temp = [...user];
        
        if (search) {
        temp = temp.filter((user) =>
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase())
        );
        }

         if (statusFilter !== 'All') {
            temp = temp.filter((user) =>
                user.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

            temp.sort((a, b) =>
                sortAsc
                    ? Number(a.id) - Number(b.id)
                    : Number(b.id) - Number(a.id)
            );


            setFilteredUsers(temp);
            setCurrentPage(1);
            console.log(temp);
    };
    const handleView = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const confirmDeleteUser = async () => {
        try {
            await axios.delete (`${API_URL}/${userToDelete.id}`);
            setShowDeleteModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error ("Error deleting user: ", err)
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);

            const updatedList = user.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
            );

            setUser(updatedList);
            applyFilters(); 
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1); 
    };


    return (
        <>
        <Header />
        <div className='d-flex'>
            <Sidebar />
            <div className='flex-grow-1'>
                <div className='container mt-4'>
                    <h3>User Management</h3>

                    {(isAdmin || isManager) && (<div className='d-flex justify-content-between align-items-center mb-4'>
                                <input
                                type='text'
                                className='form-control w-25'
                                placeholder='Search by name'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                />

                                <select
                                className='form-select w-25'
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                <option value='All'>All Status</option>
                                <option value='Active'>Active</option>
                                <option value='Inactive'>Inactive</option>
                                </select>

                                <button
                                className='btn btn-secondary'
                                onClick={() => setSortAsc((prev) => !prev)}
                                >
                                Sort {sortAsc ? '▲' : '▼'}
                                </button>
                            </div>
                    )}

                            <UserTable users={currentUsers} onView={handleView}/>


                    {filteredUsers.length > usersPerPage && (
                        <div className="d-flex justify-content-center mt-4">
                            <ReactPaginate
                            pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageClick}
                            containerClassName="pagination"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            activeClassName="active"
                            breakLabel="..."
                            previousLabel="Previous"
                            nextLabel="Next"
                            forcePage={currentPage - 1} 
                            />
                        </div>
                    )}

                    <UserModal
                        show={showModal}
                        user={selectedUser}
                        onClose={() => setShowModal(false)}
                        onDelete={userId => {
                            const userDeleted = user.find((u) => u.id=== userId);
                            setUserToDelete(userDeleted);
                            setShowDeleteModal(true);
                        }}
                        onSave={handleUpdateUser}   
                        currentUser={currentUser}
                    />

                </div>
            </div>
        </div>
        <DeleteConfirmModal 
            show ={showDeleteModal}
            user = {userToDelete}
            onConfirm={confirmDeleteUser}
            onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

export default UsersList;

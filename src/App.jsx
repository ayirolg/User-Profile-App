import React from 'react';
import  {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import { useSelector } from 'react-redux';
import UserDataPage from './pages/userDataPage';

const App=() =>{
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path ='/dashboard' element={<Dashboard />} />
        <Route path="/users" element={<UsersList />
          }></Route>
        <Route path="/user-data" element={<UserDataPage/>}></Route>
      </Routes>
    </Router>  
    );
};

export default App;
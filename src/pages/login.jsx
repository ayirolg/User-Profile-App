import React, {useState, useRef, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../redux/userSlice';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const API_URL = '/api/users'

const Login =() => {
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [error, setError] =useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailInputRef = useRef (null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (emailInputRef.current){
            emailInputRef.current.focus();
        }
    },[]);
    const handleLogin =async (e) =>{
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.get(API_URL);
            const users = res.data;

            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            if(user) {
                setTimeout(() => {
                    dispatch(loginUser(user));
                    navigate('/dashboard');
                }, 500) ;
            } else {
                setError('Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            console.error ('Login error: ', err);
            setError('Something went wrong. Please try again');
            setLoading(false);
        }
    };

    

    return (
        <div 
            className="d-flex justify-content-center align-items-center glass-card shadow p-4"
              style={{ height: '100vh', width: '100vw', backgroundColor:"rgb(230, 230, 236)"}}
            >
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="text-center mb-4">User Profile Login</h3>
            <form onSubmit={handleLogin} className='mx-auto' style={{maxWidth:'400px'}}>
                <div className='mb-3'>
                    <label className='form-label'>Email</label>
                    <input type='email'
                        className='form-control'
                        ref={emailInputRef}
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    /> 
                </div>
                <div className='mb-3 password-wrapper position-relative'>
                    <label className='form-label'>Password</label>
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        className='form-control'
                        value={password}
                        onChange={(e) =>setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
                        >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>                    
                    </button>
                </div>
                {error && <div className='alert alert-danger'>{error}</div>}
                <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                        'Login'
                    )}
                </button>
                <div className="text-center mt-2">
                    <button
                        type="button"
                        className="forgot-link"
                        onClick={() => setShowForgotModal(true)}
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>
            <ForgotPasswordModal
                    show={showForgotModal}
                    onClose={() => setShowForgotModal(false)}
            />
            </div>
        </div>
    )
};

export default Login;
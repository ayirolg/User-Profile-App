import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ForgotPasswordModal = ({ show, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');

  const API_URL = '/api/users';

  const handleEmailCheck = async () => {
    try {
      const res = await axios.get(API_URL);
      const user = res.data.find((u) => u.email === email);

      if (user) {
        setFoundUser(user);
        setStep(2);
      } else {
        setStatus('Email not found.');
      }
    } catch (err) {
      setStatus('Something went wrong.');
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      return setStatus('Passwords do not match');
    }

    try {
      await axios.put(`${API_URL}/${foundUser.id}`, {
        ...foundUser,
        password: newPassword,
      });

      setStatus('✅ Password updated successfully!');
      setTimeout(() => {
        onClose();
        resetState();
      }, 1500);
    } catch (err) {
      setStatus('Failed to update password.');
    }
  };

  const resetState = () => {
    setStep(1);
    setEmail('');
    setFoundUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setStatus('');
  };

  return (
    <Modal show={show} onHide={() => { onClose(); resetState(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <>
            <Form.Label>Enter your registered email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="mt-3 w-100" onClick={handleEmailCheck}>
              Next →
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className="mt-3 w-100" onClick={handlePasswordReset}>
              Save New Password
            </Button>
          </>
        )}

        {status && (
          <div className={`mt-3 text-${status.startsWith('✅') ? 'success' : 'danger'}`}>
            {status}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;

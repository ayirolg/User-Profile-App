// src/components/DeleteConfirmModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ show, onConfirm, onCancel, user }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Yes, Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;

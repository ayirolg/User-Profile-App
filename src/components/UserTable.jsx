import React from "react";

const UserTable = ({ users, onView }) => {
  return (
    <table className="table table-bordered table-hover bg-white">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.role}</td>
            <td>
              <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                {user.status}
              </span>
            </td>
            <td>
              <button className="btn btn-outline-primary btn-sm" onClick={() => onView(user)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

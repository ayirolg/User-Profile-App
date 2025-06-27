import React from 'react';

const StatCard = ({ title, value, bg = 'primary' }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card text-white bg-${bg} shadow user-card`}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text fs-4">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
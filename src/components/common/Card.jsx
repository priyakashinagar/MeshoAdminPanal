import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg shadow bg-white p-4 ${className}`}>
    {children}
  </div>
);

export default Card;

import React from 'react';

const Input = ({ className = '', ...props }) => (
  <input
    className={`border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default Input;

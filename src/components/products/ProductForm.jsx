import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const ProductForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
        <Button type="button" onClick={onCancel} className="p-1 bg-gray-200 hover:bg-gray-300">
          X
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <Input name="price" value={formData.price} onChange={handleChange} placeholder="$0.00" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input name="category" value={formData.category} onChange={handleChange} placeholder="Select category" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Stock Quantity</label>
          <Input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="0" required />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300">Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">{initialData ? 'Update Product' : 'Add Product'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;

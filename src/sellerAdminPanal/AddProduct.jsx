
import React, { useState } from 'react';
import Card from '../components/common/Card';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.category) {
      setError('Please fill all required fields.');
      return;
    }
    setSuccess('Product added successfully!');
    setForm({ name: '', price: '', stock: '', category: '', description: '', image: null });
  };

  return (
    <div className="md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">Add New Product</h2>
      <p className="text-purple-500 mb-8 text-lg">Fill the form below to add a new product to your store.</p>
      <div className="max-w-xl w-full mx-auto px-2 sm:px-0">
        <Card className="p-2 sm:p-8 border border-purple-100 shadow-2xl rounded-2xl bg-white">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">Product Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white"
              />
              {form.image && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(form.image)} alt="Preview" className="h-24 rounded-xl border border-purple-200 object-cover" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  placeholder="Enter price"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Stock *</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  placeholder="Enter stock quantity"
                  required
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="Enter category"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-3 rounded-xl shadow font-semibold mt-4 w-full text-lg"
            >
              Add Product
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
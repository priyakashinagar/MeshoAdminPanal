import React, { useState } from "react";
import AdminLayout from '../components/layout/AdminLayout';

const Categories = () => {
  // Dummy data for table
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", description: "Electronic items" },
    { id: 2, name: "Clothing", description: "Apparel and accessories" },
    { id: 3, name: "Books", description: "Books and magazines" },
  ]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.description) {
      if (editId !== null) {
        setCategories(categories.map(cat => cat.id === editId ? { ...cat, name: form.name, description: form.description } : cat));
      } else {
        setCategories([
          ...categories,
          {
            id: categories.length + 1,
            name: form.name,
            description: form.description,
          },
        ]);
      }
      setForm({ name: '', description: '' });
      setShowModal(false);
      setEditId(null);
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditId(cat.id);
    setShowModal(true);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="relative  ">
        <h2 className="text-3xl font-bold text-purple-900 mb-6">Categories Management</h2>
        {/* Search Bar and Add Category Button */}
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search Category Name"
              value={search}
              onChange={handleSearchChange}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base white-space-nowrap"
            onClick={() => setShowModal(true)}
          >
            Add Category
          </button>
        </div>

        {/* Modal for Add Category */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-purple-200 relative">
              <h2 className="text-xl font-bold mb-6 text-purple-700">Add Category</h2>
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table faded when modal is open */}
        <div className={showModal ? "opacity-40 pointer-events-none blur-sm" : "opacity-100"}>
          <div className="bg-white rounded-lg shadow p-6">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-purple-900">{cat.id}</td>
                    <td className="px-6 py-4">{cat.name}</td>
                    <td className="px-6 py-4">{cat.description}</td>
                    <td className="px-6 py-4 flex flex-row gap-3 items-center">
                      <button className="text-red-600 font-bold not-italic hover:underline" onClick={() => handleDelete(cat.id)}>Delete</button>
                      <button className="font-bold not-italic hover:underline" style={{ color: '#A259F7' }} onClick={() => handleEdit(cat)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;

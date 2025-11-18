import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { Truck, Trash2, Search } from 'lucide-react';

const initialShipping = [
  { id: 1, method: 'FedEx', tracking: '123456789', status: 'Delivered', date: '2025-11-01' },
  { id: 2, method: 'DHL', tracking: '987654321', status: 'In Transit', date: '2025-11-02' },
  { id: 3, method: 'UPS', tracking: '456789123', status: 'Pending', date: '2025-11-03' },
];

const Shipping = () => {
  const [shipping, setShipping] = useState(initialShipping);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ method: '', tracking: '', status: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.method && form.tracking && form.status && form.date) {
      setShipping([
        ...shipping,
        {
          id: shipping.length + 1,
          method: form.method,
          tracking: form.tracking,
          status: form.status,
          date: form.date,
        },
      ]);
      setForm({ method: '', tracking: '', status: '', date: '' });
      setShowModal(false);
    }
  };

  const filteredShipping = shipping.filter(s =>
    s.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tracking.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Shipping</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Shipments: {shipping.length}</p>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search by method or tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base"
            onClick={() => setShowModal(true)}
          >
            Add Shipment
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-4">
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Method</label>
                  <input
                    type="text"
                    name="method"
                    placeholder="Shipping Method"
                    value={form.method}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Tracking</label>
                  <input
                    type="text"
                    name="tracking"
                    placeholder="Tracking Number"
                    value={form.tracking}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Status</label>
                  <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    placeholder="Date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Shipment</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6 mt-0">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-left">Tracking</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipping.map((item) => (
                <tr key={item.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-purple-900 flex items-center gap-2"><Truck size={16} />{item.method}</td>
                  <td className="px-6 py-4 text-purple-900">{item.tracking}</td>
                  <td className="px-6 py-4 text-purple-900">{item.status}</td>
                  <td className="px-6 py-4 text-purple-900">{item.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-red-600 font-bold hover:underline" onClick={() => setShipping(shipping.filter(s => s.id !== item.id))}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Shipping;

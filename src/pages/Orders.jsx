import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';


const initialOrders = [
  { id: 'ORD-001', customer: 'John Doe', date: '2024-11-10', amount: '$499.99', status: 'Completed' },
  { id: 'ORD-002', customer: 'Jane Smith', date: '2024-11-12', amount: '$249.50', status: 'Pending' },
  { id: 'ORD-003', customer: 'Mike Johnson', date: '2024-11-13', amount: '$1,299.99', status: 'Shipped', items: 5 },
  { id: 'ORD-004', customer: 'Sarah Williams', date: '2024-11-14', amount: '$89.99', status: 'Processing', items: 1 },
  { id: 'ORD-005', customer: 'Robert Brown', date: '2024-11-15', amount: '$599.00', status: 'Completed', items: 4 },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customer: '', date: '', amount: '', status: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders([...orders, { id: `ORD-${orders.length + 1}`, ...formData }]);
    setShowForm(false);
    setFormData({ customer: '', date: '', amount: '', status: '' });
  };
    // ...existing code...
  const handleDelete = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-900">Orders Management</h1>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Add Order</Button>
        </div>
        {/* Table faded when modal is open */}
        <div className={showForm ? "opacity-40 pointer-events-none blur-sm" : "opacity-100"}>
          <Card className="border border-purple-200 shadow-lg overflow-hidden bg-white">
            <table className="w-full">
              <thead style={{ background: '#9E1CF0' }} className="text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-purple-600">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">{order.amount}</td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" onClick={() => handleDelete(order.id)} className="text-red-600 px-4 py-1 font-semibold">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        {/* Modal Form with blurred background */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-purple-200 relative">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Customer</label>
                  <input name="customer" value={formData.customer} onChange={handleChange} required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Date</label>
                  <input name="date" type="date" value={formData.date} onChange={handleChange} required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Amount</label>
                  <input name="amount" value={formData.amount} onChange={handleChange} required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} required
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50">
                    <option value="">Select status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl">Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Order</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;

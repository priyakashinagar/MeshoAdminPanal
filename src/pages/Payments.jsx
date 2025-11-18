import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { CreditCard, Trash2, Search } from 'lucide-react';

const initialPayments = [
  { id: 1, method: 'Credit Card', amount: 1200, status: 'Paid', date: '2025-11-01' },
  { id: 2, method: 'PayPal', amount: 500, status: 'Pending', date: '2025-11-02' },
  { id: 3, method: 'Bank Transfer', amount: 800, status: 'Failed', date: '2025-11-03' },
];

const Payments = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ method: '', amount: '', status: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.method && form.amount && form.status && form.date) {
      setPayments([
        ...payments,
        {
          id: payments.length + 1,
          method: form.method,
          amount: Number(form.amount),
          status: form.status,
          date: form.date,
        },
      ]);
      setForm({ method: '', amount: '', status: '', date: '' });
      setShowModal(false);
    }
  };

  const filteredPayments = payments.filter(p =>
    p.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Payments</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Payments: {payments.length}</p>
        </div>
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <Search size={22} className="text-purple-600 dark:text-purple-300" />
            <input
              type="text"
              placeholder="Search by method..."
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
            Add Payment
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
                    placeholder="Payment Method"
                    value={form.method}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
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
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Payment</button>
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
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-purple-900 flex items-center gap-2"><CreditCard size={16} />{item.method}</td>
                  <td className="px-6 py-4 text-purple-900">₹{item.amount}</td>
                  <td className="px-6 py-4 text-purple-900">{item.status}</td>
                  <td className="px-6 py-4 text-purple-900">{item.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-red-600 font-bold hover:underline" onClick={() => setPayments(payments.filter(p => p.id !== item.id))}><Trash2 size={16} /></button>
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

export default Payments;

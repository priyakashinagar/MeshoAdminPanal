
import React, { useState } from 'react';

const dummyReturns = [
  { id: 'RET-001', date: '2025-11-15', product: 'Kurti', amount: 1200, status: 'Approved' },
  { id: 'RET-002', date: '2025-11-14', product: 'Saree', amount: 2000, status: 'Pending' },
  { id: 'RET-003', date: '2025-11-13', product: 'Jeans', amount: 900, status: 'Rejected' },
];

export default function Returns() {
  const [returns, setReturns] = useState(dummyReturns);
  const [search, setSearch] = useState('');
  const [editReturn, setEditReturn] = useState(null);
  const [detailReturn, setDetailReturn] = useState(null);
  const [deleteReturn, setDeleteReturn] = useState(null);
  const [editForm, setEditForm] = useState({ id: '', date: '', product: '', amount: '', status: '' });

  const filteredReturns = returns.filter(ret =>
    ret.product.toLowerCase().includes(search.toLowerCase()) || ret.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = ret => {
    setDeleteReturn(ret);
  };
  const handleDeleteConfirm = () => {
    setReturns(returns.filter(ret => ret.id !== deleteReturn.id));
    setDeleteReturn(null);
  };

  const handleEditClick = ret => {
    setEditReturn(ret);
    setEditForm(ret);
  };
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = e => {
    e.preventDefault();
    setReturns(returns.map(ret => ret.id === editReturn.id ? { ...editForm } : ret));
    setEditReturn(null);
  };

  const handleDetailClick = ret => {
    setDetailReturn(ret);
  };

  return (
    <div className="md:p-4">
      <h2 className="text-2xl font-bold mb-2">Returns</h2>
      <p className="text-purple-700 mb-6">View and manage product returns.</p>
      <div className="flex items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <input
            type="text"
            placeholder="Search Return ID or Product"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-purple-100 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Return ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Date</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Product</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map(ret => (
              <tr key={ret.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-purple-900">{ret.id}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">{ret.date}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">{ret.product}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{ret.amount.toLocaleString()}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-normal ${ret.status === 'Approved' ? 'bg-green-100 text-green-700' : ret.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{ret.status}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 flex flex-row items-center justify-between">
                  <button className="text-purple-600 font-bold hover:underline" onClick={() => handleDetail(returnItem)}>Detail</button>
                  <button className="font-bold hover:underline text-purple-600 ml-16 mr-4" onClick={() => handleEdit(returnItem)}>Edit</button>
                  <button className="text-red-600 font-bold hover:underline" onClick={() => handleDelete(returnItem)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteReturn && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-200 relative">
            <h2 className="text-xl font-bold mb-6 text-red-600">Delete Return</h2>
            <p className="mb-6 text-purple-700">Do you want to delete return <span className="font-bold">{deleteReturn.id}</span> ({deleteReturn.product})?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setDeleteReturn(null)}>Cancel</button>
              <button className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow" onClick={() => { handleDeleteConfirm(); setDeleteReturn(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - MyProducts Style (Blurred, Scrollable, Modern UI) */}
      {editReturn && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-purple-200 relative hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
            <h2 className="text-xl font-bold mb-6 text-purple-700">Edit Return</h2>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Product</label>
                <input name="product" value={editForm.product} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Product" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Amount</label>
                <input name="amount" type="number" value={editForm.amount} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Amount" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Date</label>
                <input name="date" value={editForm.date} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Date" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50">
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setEditReturn(null)}>Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal - Admin Panel Style */}
      {detailReturn && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-200 relative">
            <h2 className="text-xl font-bold mb-6 text-purple-700">Return Details</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Return ID:</span> {detailReturn.id}</div>
              <div><span className="font-semibold">Date:</span> {detailReturn.date}</div>
              <div><span className="font-semibold">Product:</span> {detailReturn.product}</div>
              <div><span className="font-semibold">Amount:</span> ₹{detailReturn.amount.toLocaleString()}</div>
              <div><span className="font-semibold">Status:</span> {detailReturn.status}</div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setDetailReturn(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
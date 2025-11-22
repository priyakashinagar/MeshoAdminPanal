
import React, { useState } from 'react';

const dummyOrders = [
  { id: 'ORD-001', date: '2025-11-18', product: 'Kurti', amount: 1200, status: 'Delivered' },
  { id: 'ORD-002', date: '2025-11-17', product: 'Saree', amount: 2000, status: 'Shipped' },
  { id: 'ORD-003', date: '2025-11-16', product: 'Jeans', amount: 900, status: 'Pending' },
];

export default function AllOrders() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(dummyOrders);
  const [editOrder, setEditOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [editForm, setEditForm] = useState({ id: '', date: '', product: '', amount: '', status: '' });

  const filteredOrders = orders.filter(order =>
    order.product.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = order => {
    setDeleteOrder(order);
  };
  const handleDeleteConfirm = () => {
    setOrders(orders.filter(order => order.id !== deleteOrder.id));
    setDeleteOrder(null);
  };

  const handleEdit = order => {
    setEditOrder(order);
    setEditForm(order);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    setOrders(orders.map(order => order.id === editOrder.id ? { ...editForm } : order));
    setEditOrder(null);
  };

  const handleDetail = order => {
    setDetailOrder(order);
  };

  return (
    <div className="md:p-4 mx-auto overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-2">All Orders</h2>
      <p className="text-purple-700 mb-6">View and manage all your orders.</p>
      <div className="flex items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <input
            type="text"
            placeholder="Search Order ID or Product"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-purple-100 w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[700px] w-full text-left max-w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Order ID</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Date</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Product</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Status</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-purple-900">{order.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">{order.date}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">{order.product}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{order.amount.toLocaleString()}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-normal ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 flex flex-row items-center justify-between">
                    <button className="text-purple-600 font-bold hover:underline" onClick={() => handleDetail(order)}>Detail</button>
                    <button className="font-bold hover:underline text-purple-600 ml-16 mr-4" onClick={() => handleEdit(order)}>Edit</button>
                    <button className="text-red-600 font-bold hover:underline" onClick={() => handleDelete(order)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Detail Modal - Blurred, Scrollable, Modern UI */}
      {detailOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-200 relative hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setDetailOrder(null)} className="absolute top-3 right-3 text-xl text-purple-600 font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Order Details</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Order ID:</span> {detailOrder.id}</div>
              <div><span className="font-semibold">Date:</span> {detailOrder.date}</div>
              <div><span className="font-semibold">Product:</span> {detailOrder.product}</div>
              <div><span className="font-semibold">Amount:</span> ₹{detailOrder.amount.toLocaleString()}</div>
              <div><span className="font-semibold">Status:</span> {detailOrder.status}</div>
            </div>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-200 relative">
            <h2 className="text-xl font-bold mb-6 text-red-600">Delete Order</h2>
            <p className="mb-6 text-purple-700">Do you want to delete order <span className="font-bold">{deleteOrder.id}</span> ({deleteOrder.product})?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setDeleteOrder(null)}>Cancel</button>
              <button className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow" onClick={() => { handleDeleteConfirm(); setDeleteOrder(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useState } from 'react';
import Card from '../components/common/Card';

const sellers = [
  {
    id: 1,
    name: 'Amit Sharma',
    email: 'amit.seller@gmail.com',
    phone: '+91 9876543210',
    store: 'Amit Fashion Hub',
    address: 'Indore, MP',
    products: [
      { id: 1, name: 'Kurti', price: 1200, stock: 45 },
      { id: 2, name: 'Saree', price: 2000, stock: 30 },
    ],
    earnings: [
      { month: 'October', amount: 12000 },
      { month: 'September', amount: 9500 },
    ],
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.seller@gmail.com',
    phone: '+91 9123456780',
    store: 'Priya Boutique',
    address: 'Bhopal, MP',
    products: [
      { id: 1, name: 'Dress', price: 1500, stock: 20 },
      { id: 2, name: 'Top', price: 800, stock: 50 },
    ],
    earnings: [
      { month: 'October', amount: 8000 },
      { month: 'September', amount: 7000 },
    ],
  },
  {
    id: 3,
    name: 'Rahul Jain',
    email: 'rahul.seller@gmail.com',
    phone: '+91 9988776655',
    store: 'Rahul Trends',
    address: 'Gwalior, MP',
    products: [
      { id: 1, name: 'Jeans', price: 900, stock: 80 },
      { id: 2, name: 'Shirt', price: 1100, stock: 40 },
    ],
    earnings: [
      { month: 'October', amount: 6000 },
      { month: 'September', amount: 5000 },
    ],
  },
];


export default function SellersProfile() {
  const [selectedId, setSelectedId] = useState(sellers[0].id);
  const [tab, setTab] = useState('info');
  const selectedSeller = sellers.find(s => s.id === selectedId);
  const totalEarnings = selectedSeller.earnings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className=" md:p-4">
      <h2 className="text-2xl font-bold mb-2">Seller Management</h2>
      <p className="text-purple-700 mb-6">Admin can view and manage seller info, products, and earnings.</p>
      <div className="w-full mx-auto px-2 sm:px-0">
        <div className="mb-6">
          <label className="block text-purple-600 font-medium mb-2">Select Seller</label>
          <select
            className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
            value={selectedId}
            onChange={e => setSelectedId(Number(e.target.value))}
          >
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>{seller.name} - {seller.store}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'info' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('info')}
          >Info</button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'products' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('products')}
          >Products</button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'earnings' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('earnings')}
          >Earnings</button>
        </div>
        {tab === 'info' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedSeller.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xl font-semibold text-purple-700">{selectedSeller.name}</div>
                  <div className="text-sm text-purple-400">{selectedSeller.store}</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Email</label>
                  <div className="text-purple-900">{selectedSeller.email}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Phone</label>
                  <div className="text-purple-900">{selectedSeller.phone}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Store Name</label>
                  <div className="text-purple-900">{selectedSeller.store}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Address</label>
                  <div className="text-purple-900">{selectedSeller.address}</div>
                </div>
              </div>
            </div>
          </Card>
        )}
        {tab === 'products' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Products</h3>
            <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] w-full text-left max-w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">ID</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Name</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Price</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSeller.products.map(product => (
                    <tr key={product.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium text-purple-900">{product.id}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">{product.name}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{product.price.toLocaleString()}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        {tab === 'earnings' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Earnings</h3>
            <div className="flex flex-row items-center gap-6 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow flex flex-row items-center justify-center h-12 min-w-[200px] px-8 gap-3">
                <span className="text-lg font-semibold">Total Earnings</span>
                <span className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
            <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] w-full text-left max-w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Month</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSeller.earnings.map((item, idx) => (
                    <tr key={idx} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-4">{item.month}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
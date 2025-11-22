import React from 'react';
import Card from '../components/common/Card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const summary = [
  { label: 'Total Sales', value: '$28,500', icon: 'dollar', color: 'purple' },
  { label: 'Total Orders', value: '1,420', icon: 'cart', color: 'pink' },
  { label: 'Products', value: '254', icon: 'box', color: 'purple' },
  { label: 'Customers', value: '892', icon: 'users', color: 'pink' },
];

const salesData = [
  { month: 'Jul', sales: 8000 },
  { month: 'Aug', sales: 12000 },
  { month: 'Sep', sales: 15000 },
  { month: 'Oct', sales: 10000 },
  { month: 'Nov', sales: 9000 },
];

const recentOrders = [
  { id: 'ORD-001', date: '2025-11-18', product: 'Kurti', amount: '₹1,200', status: 'Delivered' },
  { id: 'ORD-002', date: '2025-11-17', product: 'Saree', amount: '₹2,000', status: 'Shipped' },
  { id: 'ORD-003', date: '2025-11-16', product: 'Jeans', amount: '₹900', status: 'Pending' },
];

export default function SellerDashboard() {
  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 space-y-6 pt-4 md:pt-0 md:pb-8 overflow-x-hidden" style={{maxWidth: '100vw', width: '100vw'}}>
      <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-6 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700 text-left">Seller Dashboard</h2>
        <p className="text-purple-500 mb-6 sm:mb-8 text-left text-base sm:text-lg">Overview of your sales, products, and orders.</p>
        {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
          {summary.map((stat, i) => {
            let Icon;
            if (stat.icon === 'dollar') {
              Icon = <svg className="text-purple-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>;
            } else if (stat.icon === 'cart') {
              Icon = <svg className="text-pink-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 9M7 13V6h13" /></svg>;
            } else if (stat.icon === 'box') {
              Icon = <svg className="text-purple-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V7m-16 6V7m16 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" /></svg>;
            } else if (stat.icon === 'users') {
              Icon = <svg className="text-pink-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
            }
            return (
              <Card
                key={i}
                className="p-1 sm:p-3 border border-purple-200 bg-white shadow-[0_2px_12px_-8px_rgba(128,0,128,0.10),0_2px_12px_-8px_rgba(236,72,153,0.10)] transition-transform duration-200 hover:scale-[1.04] w-full"
                style={{minHeight: '70px'}}
              >
                <div className="flex justify-between items-start h-full">
                  <div>
                    <p className={`text-sm ${stat.color === 'purple' ? 'text-purple-600' : 'text-pink-600'} font-medium`}>{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <svg width="16" height="16" fill="none" stroke="green" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>
                      <span className="text-xs text-green-500">+5% this week</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color === 'purple' ? 'bg-purple-100' : 'bg-pink-100'}`}>{Icon}</div>
                </div>
              </Card>
            );
          })}
        </div>
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow p-1 sm:p-4 mb-8 border border-purple-100 w-full">
          <h3 className="text-xl font-bold mb-4 text-purple-700">Sales Trend</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#9333ea" />
                <YAxis stroke="#9333ea" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Recent Orders Table */}
                  <div className="bg-white rounded-lg shadow p-1 sm:p-3 border border-purple-100 overflow-x-auto w-full">
                  <h3 className="text-lg font-bold mb-4 text-purple-700 text-left">Recent Orders</h3>
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-[700px] w-full text-left max-w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Order ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Product</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-purple-900">{order.id}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order.date}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order.product}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">{order.amount}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
                      </table>
                    </div>
        </div>
      </div>
    </div>
  );
}
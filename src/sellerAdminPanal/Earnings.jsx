import React from 'react';

const dummyEarnings = [
  { month: 'October', amount: 12000 },
  { month: 'September', amount: 9500 },
  { month: 'August', amount: 10200 },
];

const totalEarnings = dummyEarnings.reduce((sum, item) => sum + item.amount, 0);

export default function Earnings() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2">Earnings</h2>
      <p className="text-purple-700 mb-4">Your total earnings for the last 3 months.</p>
      <div className="flex flex-row items-center justify-between mb-6 gap-4 w-full">
        <div className="flex items-center flex-grow">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="20" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search Earnings..."
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
        </div>
        <div
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow flex flex-row items-center justify-center h-12 min-w-[300px] px-8 gap-3"
          style={{ height: '48px' }}
        >
          <span className="text-lg font-semibold">Total Earnings</span>
          <span className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</span>
        </div>
      </div>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Month</th>
            <th className="px-4 py-3 text-left">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {dummyEarnings.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-3">{item.month}</td>
              <td className="px-4 py-3 font-bold text-purple-700">₹{item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
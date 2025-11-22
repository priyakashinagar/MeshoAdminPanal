import React from 'react';

const dummyPayouts = [
  { id: 'PAYOUT-001', date: '2025-11-10', amount: 5000, status: 'Completed' },
  { id: 'PAYOUT-002', date: '2025-10-15', amount: 7000, status: 'Pending' },
  { id: 'PAYOUT-003', date: '2025-09-20', amount: 3000, status: 'Completed' },
];

const totalPayouts = dummyPayouts.reduce((sum, item) => sum + item.amount, 0);

export default function Payouts() {
  return (
    <div className="p-2 sm:p-4 md:p-6 overflow-x-hidden flex flex-col gap-4 items-center w-full" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <h2 className="text-2xl font-bold mb-2">Payouts</h2>
      <p className="text-purple-700 mb-4">Summary of your recent payouts.</p>
      <div className="flex flex-row items-center justify-between mb-6 gap-4 w-full">
        <div className="flex items-center flex-grow">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search Payouts..."
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
        </div>
        <div
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow flex flex-row items-center justify-center h-12 min-w-[300px] px-8 gap-3"
          style={{ height: '48px' }}
        >
          <span className="text-lg font-semibold">Total Payouts</span>
          <span className="text-2xl font-bold">₹{totalPayouts.toLocaleString()}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-purple-100 w-full">
        <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] w-full text-left max-w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Payout ID</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Date</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount (₹)</th>
                <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyPayouts.map((item, idx) => (
                <tr key={idx} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-purple-900">{item.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">{item.date}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{item.amount.toLocaleString()}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-normal ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
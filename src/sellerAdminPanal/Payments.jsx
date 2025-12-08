import React from 'react';
import { CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Payments() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Payments</h2>
      <p className="text-gray-600 mb-6">Track your payment history and pending settlements.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="text-green-600" size={24} />
            <h3 className="font-semibold text-gray-700">Total Received</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-orange-600" size={24} />
            <h3 className="font-semibold text-gray-700">Pending</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-blue-600" size={24} />
            <h3 className="font-semibold text-gray-700">This Month</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-purple-600" size={24} />
            <h3 className="font-semibold text-gray-700">Next Payout</h3>
          </div>
          <div className="text-sm text-gray-600">No upcoming payout</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="text-center py-12 text-gray-500">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No payment transactions yet</p>
        </div>
      </div>
    </div>
  );
}

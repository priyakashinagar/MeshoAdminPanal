import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import paymentService from '../services/paymentService';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingAmount: 0,
    thisMonth: 0,
    completedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const getSellerId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.sellerId || user?.seller?._id || user?._id;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const sellerId = getSellerId();
      const response = await paymentService.getAllPayments({ sellerId, status: filter });
      setPayments(response.data.payments || []);
      setStats(response.data.stats || stats);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Payments</h2>
      <p className="text-gray-600 mb-6">Track your payment history and pending settlements.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-600" size={24} />
            <h3 className="font-semibold text-gray-700">Total Earnings</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-orange-600" size={24} />
            <h3 className="font-semibold text-gray-700">Pending</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{stats.pendingAmount?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="font-semibold text-gray-700">This Month</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{stats.thisMonth?.toLocaleString() || 0}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-purple-600" size={24} />
            <h3 className="font-semibold text-gray-700">Completed</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.completedTransactions || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No payment transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Settlement</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {payment.orderId?.orderNumber || payment.orderId || 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">₹{payment.amount?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Net: ₹{payment.netAmount?.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 capitalize">
                      {payment.paymentMethod || 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                        {payment.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {payment.settlementDate ? formatDate(payment.settlementDate) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

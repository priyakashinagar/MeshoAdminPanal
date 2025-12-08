import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { CreditCard, Search, Loader2, AlertCircle, IndianRupee, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import adminService from '../services/adminService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 });

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getPayments({ 
        page, 
        limit: 15, 
        search: searchTerm,
        status: statusFilter 
      });
      if (response.success) {
        setPayments(response.data.payments);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      case 'refunded': return <RefreshCw size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && payments.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading payments...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && payments.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => fetchPayments(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Payments</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Transactions: {pagination.total}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
            <p className="text-sm text-purple-600 dark:text-purple-300">Total Amount</p>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-50 flex items-center">
              <IndianRupee size={18} />{stats.total?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow">
            <p className="text-sm text-green-600">Completed</p>
            <p className="text-xl font-bold text-green-700 flex items-center">
              <IndianRupee size={18} />{stats.completed?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-xl font-bold text-yellow-700 flex items-center">
              <IndianRupee size={18} />{stats.pending?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow">
            <p className="text-sm text-red-600">Failed</p>
            <p className="text-xl font-bold text-red-700 flex items-center">
              <IndianRupee size={18} />{stats.failed?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow">
            <p className="text-sm text-blue-600">Refunded</p>
            <p className="text-xl font-bold text-blue-700 flex items-center">
              <IndianRupee size={18} />{stats.refunded?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-80">
            <Search size={22} className="text-purple-600 dark:text-purple-300" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-base placeholder-purple-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-purple-200 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-50"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-purple-600">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-purple-900 dark:text-purple-50">
                      #{payment.orderId?.slice(-8).toUpperCase() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50">
                      <div>
                        <p className="font-medium">{payment.customerName || 'N/A'}</p>
                        <p className="text-xs text-purple-500">{payment.customerEmail || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50 flex items-center gap-2">
                      <CreditCard size={16} className="text-pink-500" />
                      {payment.method || 'COD'}
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50 font-semibold">
                      <span className="flex items-center">
                        <IndianRupee size={14} />{payment.amount?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50">
                      {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => fetchPayments(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-purple-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchPayments(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Payments;

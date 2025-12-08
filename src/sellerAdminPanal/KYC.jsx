
import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, FileText, Store, Eye } from 'lucide-react';
import adminService from '../services/adminService';

export default function KYC() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, submitted: 0 });
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchKYCSubmissions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getKYCSubmissions({ 
        page, 
        limit: 15,
        status: statusFilter 
      });
      if (response.success) {
        setSubmissions(response.data.submissions);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch KYC submissions');
      console.error('Error fetching KYC:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCSubmissions(1);
  }, [statusFilter]);

  const handleVerify = async (sellerId, status, reason = '') => {
    try {
      setUpdating(sellerId);
      await adminService.verifySeller(sellerId, { status, rejectionReason: reason });
      fetchKYCSubmissions(pagination.page);
      setSelectedSeller(null);
    } catch (err) {
      console.error('Error updating KYC:', err);
      alert('Failed to update KYC status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-purple-100 text-purple-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} className="text-green-500" />;
      case 'pending': return <Clock size={14} className="text-yellow-500" />;
      case 'submitted': return <FileText size={14} className="text-blue-500" />;
      case 'rejected': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-purple-600">Loading KYC submissions...</span>
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={() => fetchKYCSubmissions(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full min-h-screen p-3 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <h2 className="text-3xl font-bold mb-4 text-purple-700 text-center">Seller KYC Management</h2>
      <p className="text-purple-500 mb-8 text-lg text-center">Review and approve seller KYC submissions</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
        <div className="bg-yellow-50 rounded-xl p-4 shadow text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-yellow-700">{stats.pending || 0}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-blue-700">{stats.submitted || 0}</p>
          <p className="text-sm text-blue-600">Submitted</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-green-700">{stats.approved || 0}</p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow text-center">
          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold text-red-700">{stats.rejected || 0}</p>
          <p className="text-sm text-red-600">Rejected</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-center mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-purple-200 bg-white text-purple-900"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600 ml-4" />}
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="p-4 md:p-8 border border-purple-100 shadow-2xl rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Seller</th>
                  <th className="px-4 py-3 text-left">Store Name</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">KYC Status</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-purple-600">
                      No KYC submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map(seller => (
                    <tr key={seller._id} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Store size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-purple-900">{seller.businessName || 'N/A'}</p>
                            <p className="text-xs text-purple-500">{seller.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-purple-900">{seller.storeName || 'N/A'}</td>
                      <td className="px-4 py-3 text-purple-900">{seller.phone || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(seller.kycStatus)}`}>
                          {getStatusIcon(seller.kycStatus)}
                          {seller.kycStatus?.replace('_', ' ').charAt(0).toUpperCase() + seller.kycStatus?.replace('_', ' ').slice(1) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-purple-900 text-sm">
                        {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSeller(seller)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                          {(seller.kycStatus === 'submitted' || seller.kycStatus === 'pending') && (
                            <>
                              <button
                                onClick={() => handleVerify(seller._id, 'approved')}
                                disabled={updating === seller._id}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                              >
                                {updating === seller._id ? <Loader2 size={14} className="animate-spin" /> : 'Approve'}
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) handleVerify(seller._id, 'rejected', reason);
                                }}
                                disabled={updating === seller._id}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => fetchKYCSubmissions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-purple-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchKYCSubmissions(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Seller Detail Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-purple-200">
            <h2 className="text-xl font-bold mb-6 text-purple-700">Seller KYC Details</h2>
            <div className="space-y-3">
              <div><span className="font-semibold text-purple-600">Business Name:</span> {selectedSeller.businessName}</div>
              <div><span className="font-semibold text-purple-600">Store Name:</span> {selectedSeller.storeName}</div>
              <div><span className="font-semibold text-purple-600">Email:</span> {selectedSeller.email}</div>
              <div><span className="font-semibold text-purple-600">Phone:</span> {selectedSeller.phone}</div>
              <div><span className="font-semibold text-purple-600">GST Number:</span> {selectedSeller.gstNumber || 'N/A'}</div>
              <div><span className="font-semibold text-purple-600">PAN Number:</span> {selectedSeller.panNumber || 'N/A'}</div>
              <div>
                <span className="font-semibold text-purple-600">Address:</span> 
                <p className="text-purple-900">{selectedSeller.businessAddress?.street}, {selectedSeller.businessAddress?.city}, {selectedSeller.businessAddress?.state} - {selectedSeller.businessAddress?.pincode}</p>
              </div>
              <div>
                <span className="font-semibold text-purple-600">KYC Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusStyle(selectedSeller.kycStatus)}`}>
                  {selectedSeller.kycStatus}
                </span>
              </div>
              <div><span className="font-semibold text-purple-600">Verified:</span> {selectedSeller.isVerified ? 'Yes' : 'No'}</div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setSelectedSeller(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, DollarSign, FileText, User, Calendar, Loader2, RefreshCw } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import adminService from '../services/adminService';

const ClaimsDisputes = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Fetching claims...');
      const response = await adminService.getClaims();
      console.log('📋 Claims Response:', response);
      
      // Handle multiple response structures
      const claimsData = response.data?.claims || response.claims || response.data || response || [];
      
      // Ensure it's an array
      if (Array.isArray(claimsData)) {
        setClaims(claimsData);
        console.log('📋 Total Claims:', claimsData.length);
      } else {
        console.warn('⚠️ Claims data is not an array:', claimsData);
        setClaims([]);
      }
    } catch (err) {
      console.error('❌ Error fetching claims:', err);
      setError(err.message || 'Failed to fetch claims');
      setClaims([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimId, newStatus) => {
    try {
      await adminService.updateClaimStatus(claimId, newStatus);
      fetchClaims(); // Refresh data
    } catch (err) {
      console.error('Error updating claim status:', err);
    }
  };

  const stats = {
    pending: Array.isArray(claims) ? claims.filter(c => c.status === 'pending').length : 0,
    inReview: Array.isArray(claims) ? claims.filter(c => c.status === 'in-review' || c.status === 'in_review').length : 0,
    resolved: Array.isArray(claims) ? claims.filter(c => c.status === 'resolved').length : 0,
    totalAmount: Array.isArray(claims) ? claims.reduce((sum, c) => c.status === 'pending' ? sum + (c.amount || 0) : sum, 0) : 0
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={fetchClaims} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status) => {
    const config = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'in-review': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'rejected': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const { color, icon: Icon } = config[status] || config.pending;
    const statusText = status === 'in-review' ? 'In-review' : status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        {statusText}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        type === 'refund' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Claims & Disputes</h1>
          <p className="text-sm text-gray-600 mt-1">Manage customer claims and dispute resolutions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">In Review</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.inReview}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 font-medium">Pending Amount</p>
          <p className="text-2xl font-bold text-purple-800 mt-1">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[900px] w-full text-left table-fixed">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-2 py-3 text-left font-semibold w-[9%] whitespace-nowrap">Claim ID</th>
                <th className="px-2 py-3 text-left font-semibold w-[7%] whitespace-nowrap">Type</th>
                <th className="px-2 py-3 text-left font-semibold w-[9%] whitespace-nowrap">Order ID</th>
                <th className="px-2 py-3 text-left font-semibold w-[11%] whitespace-nowrap">Customer</th>
                <th className="px-2 py-3 text-left font-semibold w-[11%] whitespace-nowrap">Seller</th>
                <th className="px-2 py-3 text-left font-semibold w-[9%] whitespace-nowrap">Amount</th>
                <th className="px-2 py-3 text-left font-semibold w-[20%] whitespace-nowrap">Reason</th>
                <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Status</th>
                <th className="px-2 py-3 text-left font-semibold w-[14%] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr><td colSpan="9" className="px-2 py-8 text-center text-gray-500">No claims found</td></tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-2 py-3 font-medium text-purple-900">{claim.id}</td>
                    <td className="px-2 py-3">{getTypeBadge(claim.type)}</td>
                    <td className="px-2 py-3">
                      <span className="font-mono text-sm text-gray-700">{claim.orderId}</span>
                    </td>
                    <td className="px-2 py-3 truncate" title={claim.customer}>{claim.customer}</td>
                    <td className="px-2 py-3 truncate" title={claim.seller}>{claim.seller}</td>
                    <td className="px-2 py-3 font-medium text-gray-900">
                      ₹{claim.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-2 py-3 truncate" title={claim.reason}>{claim.reason}</td>
                    <td className="px-2 py-3">{getStatusBadge(claim.status)}</td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2 items-center flex-nowrap whitespace-nowrap">
                        <button className="text-purple-600 font-bold hover:underline text-sm">
                          Detail
                        </button>
                        {claim.status === 'pending' && (
                          <>
                            <button className="text-green-600 font-bold hover:underline text-sm">
                              Approve
                            </button>
                            <button className="text-red-600 font-bold hover:underline text-sm">
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
      </div>
    </div>
    </AdminLayout>
  );
};

export default ClaimsDisputes;

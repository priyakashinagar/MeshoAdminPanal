import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, Plus, X, Eye } from 'lucide-react';
import claimService from '../services/claimService';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    claimType: 'damaged',
    description: '',
    claimAmount: 0
  });

  const getSellerId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.sellerId || user?.seller?._id || user?._id;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const sellerId = getSellerId();
      const response = await claimService.getAllClaims({ sellerId });
      setClaims(response.data.claims || []);
      
      // Calculate stats
      const active = response.data.claims?.filter(c => c.status === 'open' || c.status === 'in-review').length || 0;
      const pending = response.data.claims?.filter(c => c.status === 'pending').length || 0;
      const resolved = response.data.claims?.filter(c => c.status === 'resolved' || c.status === 'closed').length || 0;
      setStats({ active, pending, resolved });
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sellerId = getSellerId();
      await claimService.createClaim({ ...formData, sellerId });
      setShowModal(false);
      setFormData({ orderId: '', claimType: 'damaged', description: '', claimAmount: 0 });
      fetchClaims();
    } catch (err) {
      console.error('Error creating claim:', err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-blue-100 text-blue-700',
      'in-review': 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      closed: 'bg-gray-100 text-gray-700'
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
        <div className="text-purple-600 text-xl">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Claims</h2>
      <p className="text-gray-600 mb-6">Manage and track your claims for damaged or lost products.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-900">Active Claims</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="text-purple-600" size={24} />
            <h3 className="font-bold text-gray-900">Pending Review</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="font-bold text-gray-900">Resolved</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Claims</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus size={20} />
            New Claim
          </button>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No claims found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Claim ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      #{claim._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                      {claim.claimType}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {claim.orderId?.orderNumber || claim.orderId || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      ₹{claim.claimAmount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(claim.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Claim Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create New Claim</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Order ID</label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter order ID"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Claim Type</label>
                <select
                  value={formData.claimType}
                  onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="damaged">Damaged Product</option>
                  <option value="lost">Lost in Transit</option>
                  <option value="defective">Defective Product</option>
                  <option value="wrong-item">Wrong Item</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Claim Amount (₹)</label>
                <input
                  type="number"
                  value={formData.claimAmount}
                  onChange={(e) => setFormData({ ...formData, claimAmount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Describe the issue..."
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Package, IndianRupee, Clock, CheckCircle, XCircle, RotateCcw, Search, Filter, TrendingUp, X, AlertTriangle } from 'lucide-react';
import adminService from '../services/adminService';
import sellerService from '../services/sellerService';

export default function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, return-tracking, claim-tracking
  const [trackingStatus, setTrackingStatus] = useState('in-transit'); // in-transit, out-for-delivery, delivered, lost, returnless-refund, disposed
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [showRateCard, setShowRateCard] = useState(false);
  const [returnTypeFilter, setReturnTypeFilter] = useState(''); // customer-return, courier-return
  const [dateFilter, setDateFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    totalRefunded: 0,
    inTransit: 0,
    outForDelivery: 0,
    delivered: 0,
    lost: 0,
    returnlessRefund: 0,
    disposed: 0
  });
  const [detailReturn, setDetailReturn] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Check if user is seller or admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSeller = user.role === 'seller';

  const fetchReturns = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { page, limit: 15, search, status: statusFilter };
      const response = isSeller 
        ? await sellerService.getReturns(params)
        : await adminService.getReturns(params);
      
      console.log('🔄 Returns Response:', response);
      console.log('🔄 Returns Data:', response.returns || response.data?.returns);
      console.log('🔄 Stats Data:', response.stats || response.data?.stats);
      
      if (response.success !== false) {
        setReturns(response.returns || response.data?.returns || []);
        setPagination(response.pagination || response.data?.pagination || { page: 1, pages: 1, total: 0 });
        setStats(response.stats || response.data?.stats || { pending: 0, approved: 0, rejected: 0, totalRefunded: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch returns');
      console.error('❌ Error fetching returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReturns(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      // Map frontend status to backend status
      const backendStatus = newStatus === 'approved' ? 'return_approved' : 
                           newStatus === 'rejected' ? 'return_rejected' : 
                           newStatus === 'refunded' ? 'returned' : newStatus;
      
      if (isSeller) {
        await sellerService.updateReturnStatus(orderId, { status: backendStatus });
      } else {
        await adminService.updateReturnStatus(orderId, { status: backendStatus });
      }
      fetchReturns(pagination.page);
    } catch (err) {
      console.error('Error updating return status:', err);
      alert(err.response?.data?.message || 'Failed to update return status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'return_approved':
      case 'approved': return 'bg-green-100 text-green-700';
      case 'return_requested':
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'return_rejected':
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'returned':
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} className="text-green-500" />;
      case 'pending': return <Clock size={14} className="text-yellow-500" />;
      case 'rejected': return <XCircle size={14} className="text-red-500" />;
      case 'refunded': return <RotateCcw size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  if (loading && returns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-purple-600">Loading returns...</span>
      </div>
    );
  }

  if (error && returns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={() => fetchReturns(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 md:p-6">
        {/* Header with E-Signature Alert */}
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-red-900">Your E-Signature is missing!</h3>
              <p className="text-red-700 text-sm">E-signature is required for raising invoices / credit notes on your behalf to customers</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
            Add Signature
          </button>
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Return/RTO Orders</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-red-600 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
              How it works?
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Order ID, SKU or AWB Number"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Courier Partner Alert */}
        <div className="mb-6 p-4 border-l-4 border-purple-500 rounded-lg flex items-start justify-between" style={{ backgroundColor: '#DBB3FF' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-purple-700 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-purple-900">Choose your courier partner for customer returns now</h3>
              <p className="text-purple-800 text-sm">Starting 1st Jan 2023, your Customer Returns claims will be investigated and approved only by your courier partners.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowRateCard(!showRateCard)}
            className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium whitespace-nowrap"
          >
            View Rate Card
          </button>
        </div>

        {/* Rate Card Section */}
        {showRateCard && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Courier Partner Rate Card</h3>
              <button onClick={() => setShowRateCard(false)} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Delhivery */}
                <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                  <h4 className="font-bold text-purple-900 mb-2">Delhivery</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-gray-600">Within City:</span> <span className="font-semibold">₹30/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Within Zone:</span> <span className="font-semibold">₹40/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Metro to Metro:</span> <span className="font-semibold">₹50/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">ROI:</span> <span className="font-semibold">₹60/kg</span></p>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Select Partner
                  </button>
                </div>

                {/* Ecom Express */}
                <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                  <h4 className="font-bold text-purple-900 mb-2">Ecom Express</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-gray-600">Within City:</span> <span className="font-semibold">₹28/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Within Zone:</span> <span className="font-semibold">₹38/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Metro to Metro:</span> <span className="font-semibold">₹48/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">ROI:</span> <span className="font-semibold">₹58/kg</span></p>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Select Partner
                  </button>
                </div>

                {/* Xpressbees */}
                <div className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                  <h4 className="font-bold text-purple-900 mb-2">Xpressbees</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-gray-600">Within City:</span> <span className="font-semibold">₹32/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Within Zone:</span> <span className="font-semibold">₹42/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">Metro to Metro:</span> <span className="font-semibold">₹52/kg</span></p>
                    <p className="flex justify-between"><span className="text-gray-600">ROI:</span> <span className="font-semibold">₹62/kg</span></p>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Select Partner
                  </button>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                  <li>Rates are per kg with minimum chargeable weight of 0.5 kg</li>
                  <li>Volumetric weight will be charged if it exceeds actual weight</li>
                  <li>GST will be charged additionally at 18%</li>
                  <li>RTO charges will be same as forward charges</li>
                  <li>COD charges: 2% of product value (min ₹20, max ₹100)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-yellow-500" />
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-500" />
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.approved || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={18} className="text-red-500" />
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee size={18} className="text-blue-500" />
              <p className="text-sm text-gray-600">Refunded</p>
            </div>
            <p className="text-xl font-bold text-gray-900 flex items-center">
              ₹{(stats.totalRefunded || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('return-tracking')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'return-tracking'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Return Tracking
            </button>
            <button
              onClick={() => setActiveTab('claim-tracking')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'claim-tracking'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Claim Tracking
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Summary Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Summary</h3>
                <select className="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>Last 1 Month</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <button
                onClick={() => setShowTrendModal(true)}
                className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"
              >
                <TrendingUp size={18} />
                View Trend
              </button>
            </div>

            {/* Product Performance */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Product Performance</h3>
                <p className="text-sm text-gray-500">Sort by:</p>
              </div>
              
              {returns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">No return orders found</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Return Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                        {!isSeller && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {returns.map((ret) => (
                        <tr key={ret._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-purple-600">{ret.orderNumber || ret._id?.slice(-8)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {ret.items?.[0]?.product?.images?.[0] && (
                                <img
                                  src={ret.items[0].product.images[0]}
                                  alt={ret.items[0].product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <span className="text-sm">{ret.items?.[0]?.product?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(ret.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ret.returnReason || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(ret.status)}`}>
                              {ret.status?.replace('return_', '').replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            ₹{(ret.pricing?.total || 0).toLocaleString()}
                          </td>
                          {!isSeller && (
                            <td className="px-4 py-3">
                              {ret.status === 'return_requested' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStatusUpdate(ret._id, 'approved')}
                                    disabled={updating === ret._id}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(ret._id, 'rejected')}
                                    disabled={updating === ret._id}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Return Tracking Tab */}
        {activeTab === 'return-tracking' && (
          <div>
            {/* Returnless Refund Banner */}
            <div className="mb-6 p-4 border border-purple-200 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#DBB3FF' }}>
              <Package className="text-purple-700 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-purple-900 mb-1">Introducing Returnless Refunds Policy - Mandatory for all sellers!</h3>
                <p className="text-purple-800 text-sm">For select cases of damaged, defective, poor-quality, or incorrect products, only trusted users will get a refund without returning the item.</p>
              </div>
              <button className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium whitespace-nowrap">
                View Returns
              </button>
            </div>

            {/* Tracking Status Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {[
                { key: 'in-transit', label: 'In transit', count: stats.inTransit || 0 },
                { key: 'out-for-delivery', label: 'Out for Delivery', count: stats.outForDelivery || 0 },
                { key: 'delivered', label: 'Delivered', count: stats.delivered || 0 },
                { key: 'lost', label: 'Lost', count: stats.lost || 0 },
                { key: 'returnless-refund', label: 'Returnless Refund', count: stats.returnlessRefund || 0, badge: 'New' },
                { key: 'disposed', label: 'Disposed', count: stats.disposed || 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTrackingStatus(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors relative ${
                    trackingStatus === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-3 items-center">
              <span className="text-sm text-gray-600 font-medium">Filter by:</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Return Created</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Expected Delivery Date</option>
                <option>Next 7 days</option>
                <option>Next 15 days</option>
                <option>Next 30 days</option>
              </select>
              <select 
                value={returnTypeFilter}
                onChange={(e) => setReturnTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Return Type</option>
                <option value="customer-return">Customer Return</option>
                <option value="courier-return">Courier Return (RTO)</option>
              </select>
              {returnTypeFilter && (
                <button
                  onClick={() => setReturnTypeFilter('')}
                  className="text-purple-600 text-sm font-medium hover:text-purple-700"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Returns List */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              {returns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">No returns in {trackingStatus.replace('-', ' ')} status</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {returns.map((ret) => (
                    <div key={ret._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {ret.items?.[0]?.product?.images?.[0] && (
                            <img
                              src={ret.items[0].product.images[0]}
                              alt={ret.items[0].product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{ret.items?.[0]?.product?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Order: {ret.orderNumber || ret._id?.slice(-8)}</p>
                            <p className="text-sm text-gray-500">Return Date: {new Date(ret.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(ret.pricing?.total || 0).toLocaleString()}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(ret.status)}`}>
                            {ret.status?.replace('return_', '').replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Claim Tracking Tab */}
        {activeTab === 'claim-tracking' && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Claims Yet</h3>
            <p className="text-gray-500">Return claims will appear here once filed</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => fetchReturns(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchReturns(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Trend Modal */}
        {showTrendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Returns Trend</h3>
                <button onClick={() => setShowTrendModal(false)}>
                  <X className="text-gray-500 hover:text-gray-700" size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Duration: Last 1 Month</p>
                <div className="flex gap-4 border-b border-gray-200">
                  <button className="px-4 py-2 border-b-2 border-purple-600 text-purple-600 font-medium">
                    Customer Return
                  </button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                    Courier Return (RTO)
                  </button>
                  <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                    Dual Pricing
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">No data as of now.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

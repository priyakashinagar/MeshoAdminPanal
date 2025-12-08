import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Truck, Loader2, AlertCircle, Package, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../services/adminService';

const Shipping = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ pending: 0, shipped: 0, inTransit: 0, delivered: 0 });
  const [updating, setUpdating] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', trackingNumber: '', carrier: '' });

  const fetchShipments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getShipments({ 
        page, 
        limit: 15, 
        search: searchTerm,
        status: statusFilter 
      });
      if (response.success) {
        setShipments(response.data.shipments);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipments');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShipments(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      setUpdating(selectedShipment._id);
      await adminService.updateShipment(selectedShipment._id, updateForm);
      setShowUpdateModal(false);
      setSelectedShipment(null);
      setUpdateForm({ status: '', trackingNumber: '', carrier: '' });
      fetchShipments(pagination.page);
    } catch (err) {
      console.error('Error updating shipment:', err);
      alert('Failed to update shipment');
    } finally {
      setUpdating(null);
    }
  };

  const openUpdateModal = (shipment) => {
    setSelectedShipment(shipment);
    setUpdateForm({
      status: shipment.status || '',
      trackingNumber: shipment.trackingNumber || '',
      carrier: shipment.carrier || ''
    });
    setShowUpdateModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'in_transit': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped': return <Truck size={16} className="text-blue-500" />;
      case 'in_transit': return <Truck size={16} className="text-yellow-500" />;
      case 'pending': return <Clock size={16} className="text-gray-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  if (loading && shipments.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading shipments...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && shipments.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => fetchShipments(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
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
          <h1 className="text-3xl font-bold text-purple-900">Shipping Management</h1>
          <p className="text-purple-600 mt-2">Total Shipments: {pagination.total}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 shadow">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-500" />
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <p className="text-2xl font-bold text-gray-700 mt-2">{stats.pending || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-blue-500" />
              <p className="text-sm text-blue-600">Shipped</p>
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">{stats.shipped || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-yellow-500" />
              <p className="text-sm text-yellow-600">In Transit</p>
            </div>
            <p className="text-2xl font-bold text-yellow-700 mt-2">{stats.inTransit || 0}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 shadow">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-sm text-green-600">Delivered</p>
            </div>
            <p className="text-2xl font-bold text-green-700 mt-2">{stats.delivered || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search by order ID or tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 outline-none w-full text-base placeholder-purple-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-purple-200 bg-white text-purple-900"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
        </div>

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8">
              <h3 className="text-xl font-bold text-purple-900 mb-4">Update Shipment</h3>
              <form onSubmit={handleUpdateShipment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Status</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-xl"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={updateForm.trackingNumber}
                    onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-xl"
                    placeholder="Enter tracking number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Carrier</label>
                  <input
                    type="text"
                    value={updateForm.carrier}
                    onChange={(e) => setUpdateForm({ ...updateForm, carrier: e.target.value })}
                    className="w-full px-4 py-2 border border-purple-200 rounded-xl"
                    placeholder="e.g., BlueDart, Delhivery"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowUpdateModal(false)}
                    className="px-6 py-2 bg-gray-200 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Carrier</th>
                <th className="px-6 py-4 text-left">Tracking</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-purple-600">
                    No shipments found
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment._id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-purple-900">
                      #{shipment.orderId?.slice(-8).toUpperCase() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-purple-900">
                      {shipment.customerName || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-purple-700">
                        <MapPin size={14} />
                        {shipment.destination || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-purple-900">
                      {shipment.carrier || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-purple-900 text-sm">
                      {shipment.trackingNumber || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status?.replace('_', ' ').charAt(0).toUpperCase() + shipment.status?.replace('_', ' ').slice(1) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-purple-900 text-sm">
                      {shipment.date ? new Date(shipment.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openUpdateModal(shipment)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200"
                      >
                        Update
                      </button>
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
              onClick={() => fetchShipments(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-purple-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchShipments(pagination.page + 1)}
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

export default Shipping;

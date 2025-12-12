import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Truck, Loader2, AlertCircle, Package, MapPin, Clock, CheckCircle, XCircle, Navigation, Phone, User } from 'lucide-react';
import adminService from '../services/adminService';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, [searchTerm, statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚚 Fetching deliveries...');
      const response = await adminService.getShipments({ 
        search: searchTerm,
        status: statusFilter 
      });
      console.log('🚚 Deliveries Response:', response);
      
      // Handle multiple response structures
      const shipmentsData = response.data?.shipments || response.shipments || response.data || response || [];
      
      if (Array.isArray(shipmentsData)) {
        setDeliveries(shipmentsData);
        console.log('🚚 Total Deliveries:', shipmentsData.length);
      } else {
        console.warn('⚠️ Deliveries data is not an array:', shipmentsData);
        setDeliveries([]);
      }
    } catch (err) {
      console.error('❌ Error fetching deliveries:', err);
      setError(err.message || 'Failed to fetch deliveries');
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    outForDelivery: Array.isArray(deliveries) ? deliveries.filter(d => d.status === 'out_for_delivery' || d.status === 'in_transit').length : 0,
    delivered: Array.isArray(deliveries) ? deliveries.filter(d => d.status === 'delivered').length : 0,
    failed: Array.isArray(deliveries) ? deliveries.filter(d => d.status === 'failed' || d.status === 'cancelled').length : 0,
    total: Array.isArray(deliveries) ? deliveries.length : 0
  };

  const getStatusBadge = (status) => {
    const config = {
      'out_for_delivery': { color: 'bg-blue-100 text-blue-800', icon: Truck, text: 'Out for Delivery' },
      'in_transit': { color: 'bg-yellow-100 text-yellow-800', icon: Package, text: 'In Transit' },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Delivered' },
      'failed': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Failed' },
      'cancelled': { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Cancelled' },
      'pending': { color: 'bg-orange-100 text-orange-800', icon: Clock, text: 'Pending' },
      'shipped': { color: 'bg-purple-100 text-purple-800', icon: Navigation, text: 'Shipped' }
    };
    
    const { color, icon: Icon, text } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        {text}
      </span>
    );
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
          <button onClick={fetchDeliveries} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Loader2 className="w-4 h-4" />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Delivery Tracking</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage all deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Out for Delivery</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">{stats.outForDelivery}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-medium">Delivered</p>
            <p className="text-2xl font-bold text-green-800 mt-1">{stats.delivered}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-medium">Failed</p>
            <p className="text-2xl font-bold text-red-800 mt-1">{stats.failed}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">{stats.total}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by Order ID, Tracking Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[1000px] w-full text-left table-fixed">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Order ID</th>
                  <th className="px-2 py-3 text-left font-semibold w-[12%] whitespace-nowrap">Tracking Number</th>
                  <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Carrier</th>
                  <th className="px-2 py-3 text-left font-semibold w-[15%] whitespace-nowrap">Customer</th>
                  <th className="px-2 py-3 text-left font-semibold w-[18%] whitespace-nowrap">Delivery Address</th>
                  <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Contact</th>
                  <th className="px-2 py-3 text-left font-semibold w-[12%] whitespace-nowrap">Status</th>
                  <th className="px-2 py-3 text-left font-semibold w-[13%] whitespace-nowrap">Expected Date</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-2 py-8 text-center text-gray-500">
                      No deliveries found
                    </td>
                  </tr>
                ) : (
                  deliveries.map((delivery) => (
                    <tr key={delivery._id || delivery.orderId} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-2 py-3">
                        <span className="font-medium text-purple-900 text-sm">
                          {delivery.orderId || delivery.orderNumber || 'N/A'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-xs text-gray-700 font-mono">
                          {delivery.trackingNumber || 'Not assigned'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-purple-500" />
                          <span className="text-sm text-gray-900">
                            {delivery.carrier || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-purple-600" />
                          </div>
                          <span className="text-sm text-gray-900 truncate">
                            {delivery.customerName || delivery.customer?.name || 'Customer'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-pink-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700 line-clamp-2">
                            {delivery.deliveryAddress || delivery.shippingAddress?.city || 'Address not available'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs text-gray-700">
                            {delivery.customerPhone || delivery.customer?.phone || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        {getStatusBadge(delivery.status || 'pending')}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        {delivery.expectedDeliveryDate ? new Date(delivery.expectedDeliveryDate).toLocaleDateString() : 
                         delivery.estimatedDelivery ? new Date(delivery.estimatedDelivery).toLocaleDateString() : 'TBD'}
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

export default Delivery;

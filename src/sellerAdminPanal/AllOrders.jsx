
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, PlayCircle, Package, Search, ChevronDown, Calendar, Shield, CheckCircle } from 'lucide-react';
import sellerService from '../services/sellerService';

export default function AllOrders() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [editForm, setEditForm] = useState({ status: '' });
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterSLA, setFilterSLA] = useState('');
  const [filterDispatch, setFilterDispatch] = useState('');
  const [filterOrderDate, setFilterOrderDate] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showScanDetailsModal, setShowScanDetailsModal] = useState(false);
  const [storeName, setStoreName] = useState('MY STORE GROCERY');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Use seller service to get orders for this seller
      const response = await sellerService.getOrders({ limit: 100 });
      console.log('📦 Seller Orders Response:', response);
      const ordersData = response.orders || response.data || [];
      console.log('📦 Orders Data:', ordersData);
      if (ordersData.length > 0) {
        console.log('📦 Sample Order:', ordersData[0]);
      }
      setOrders(ordersData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByTab = () => {
    return orders.filter(order => {
      const status = order.status?.toLowerCase();
      switch(activeTab) {
        case 'on-hold': return status === 'on_hold' || status === 'hold';
        case 'pending': return status === 'pending' || status === 'confirmed';
        case 'ready': return status === 'processing';
        case 'shipped': return status === 'shipped';
        case 'cancelled': return status === 'cancelled';
        default: return true;
      }
    });
  };

  const filteredOrders = getOrdersByTab().filter(order => {
    const productName = order.items?.[0]?.product?.name || order.product || '';
    const orderId = order.orderNumber || order._id || '';
    const skuMatch = search.toLowerCase();
    return productName.toLowerCase().includes(skuMatch) || 
           orderId.toLowerCase().includes(skuMatch);
  });

  const getTabCount = (tab) => {
    return orders.filter(order => {
      const status = order.status?.toLowerCase();
      switch(tab) {
        case 'on-hold': return status === 'on_hold' || status === 'hold';
        case 'pending': return status === 'pending' || status === 'confirmed';
        case 'ready': return status === 'processing';
        case 'shipped': return status === 'shipped';
        case 'cancelled': return status === 'cancelled';
        default: return false;
      }
    }).length;
  };

  const handleEdit = order => {
    setEditOrder(order);
    setEditForm({ status: order.status || 'pending' });
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      setUpdating(true);
      // Use seller service to update order status
      await sellerService.updateOrderStatus(editOrder._id || editOrder.id, editForm.status);
      await fetchOrders();
      setEditOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const handleDetail = order => {
    setDetailOrder(order);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'processing': 'bg-purple-100 text-purple-700',
      'confirmed': 'bg-cyan-100 text-cyan-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700',
      'return_requested': 'bg-orange-100 text-orange-700',
      'return_approved': 'bg-green-100 text-green-700',
      'return_rejected': 'bg-red-100 text-red-700',
      'returned': 'bg-blue-100 text-blue-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* E-Signature Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-red-900">Your E-Signature is missing!</h3>
            <p className="text-red-700 text-sm">E-signature is required for raising invoices / credit notes on your behalf to customers</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSignatureModal(true)}
          className="px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium whitespace-nowrap"
        >
          Add Signature
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
              <PlayCircle size={20} />
              Learn how to process your orders?
            </button>
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              <Download size={18} />
              Download Orders Data
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Label Download Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-4">
          <Package size={48} className="text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 text-2xl">✗</span>
              <h3 className="font-bold text-gray-900 text-lg">Label download failed?</h3>
              <span className="text-green-600 text-2xl ml-2">✓</span>
              <h3 className="font-bold text-gray-900 text-lg">Meesho will retry automatically</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>We will <strong>notify you once it's ready for download</strong></p>
              <p>Don't worry! Your order will <strong>not be blocked or lose visibility</strong></p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Barcode Packaging Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Package size={32} className="text-blue-600" />
            <p className="text-gray-800">
              As per Meesho packaging policy, all sellers must use <strong>Transparent Barcoded Packaging</strong> for their products on the platform.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowBuyModal(true)}
              className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium whitespace-nowrap"
            >
              Buy Barcoded Packets
            </button>
            <button 
              onClick={() => setShowScanDetailsModal(true)}
              className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium whitespace-nowrap"
            >
              Scan Barcoded Packets
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'on-hold', label: 'On Hold' },
            { key: 'pending', label: 'Pending' },
            { key: 'ready', label: 'Ready to Ship' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label} ({getTabCount(tab.key)})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-200 flex-wrap">
          <span className="text-gray-700 font-medium">Filter by:</span>
          <select 
            value={filterSLA}
            onChange={e => setFilterSLA(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="">SLA Status</option>
            <option value="on-time">On Time</option>
            <option value="delayed">Delayed</option>
          </select>
          <select 
            value={filterDispatch}
            onChange={e => setFilterDispatch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="">Label downloaded</option>
            <option value="downloaded">Downloaded</option>
            <option value="not-downloaded">Not Downloaded</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="">All Filters</option>
            <option value="payment-pending">Payment Pending</option>
            <option value="pickup-pending">Pickup Pending</option>
            <option value="urgent">Urgent Orders</option>
          </select>

          <div className="flex items-center gap-2 ml-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select 
              value={filterOrderDate}
              onChange={e => setFilterOrderDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
            >
              <option value="">SKU ID</option>
              <option value="order-date">Order Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="flex-1 relative ml-auto">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 w-32"
            >
              <option value="">SKU ID</option>
              <option value="order-id">Order ID</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder=""
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-12"
            />
          </div>
        </div>
      </div>
      
      {error && (
        <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-xl">Loading orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center m-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 border border-gray-200 text-center m-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No orders in this category</p>
        </div>
      ) : (
        <div className="bg-white m-4 rounded-lg shadow border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const displayStatus = order.status?.replace('return_', '') || order.status;
                  const isReturnOrder = order.status?.startsWith('return_');
                  return (
                  <tr key={order._id || order.orderNumber} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{order.orderId || order.orderNumber || order._id?.slice(-8)}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{formatDate(order.createdAt || order.date)}</td>
                    <td className="px-4 py-4 text-gray-700">{order.items?.[0]?.name || order.items?.[0]?.product?.name || order.product || 'N/A'}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900">₹{(order.pricing?.total || order.totalAmount || order.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {isReturnOrder && '↩ '}{displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm" onClick={() => handleDetail(order)}>View Details</button>
                        {!isReturnOrder && (
                          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm" onClick={() => handleEdit(order)}>Update</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
              <button onClick={() => setEditOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order: <span className="font-mono text-purple-600">{editOrder.orderNumber || editOrder._id?.slice(-8)}</span>
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700" 
                  onClick={() => setEditOrder(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button onClick={() => setDetailOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Order ID</span>
                  <p className="font-mono font-medium text-gray-900">{detailOrder.orderId || detailOrder.orderNumber || detailOrder._id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Order Date</span>
                  <p className="font-medium text-gray-900">{formatDate(detailOrder.createdAt || detailOrder.date)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(detailOrder.status)}`}>
                      {detailOrder.status?.replace('return_', '')}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <p className="font-bold text-gray-900 text-lg">₹{(detailOrder.pricing?.total || detailOrder.totalAmount || detailOrder.amount || 0).toLocaleString()}</p>
                </div>
              </div>

              {detailOrder.status?.startsWith('return_') && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Return Information</h3>
                  {detailOrder.returnReason && (
                    <div className="text-sm text-orange-800 mb-1">
                      <span className="font-medium">Reason:</span> {detailOrder.returnReason}
                    </div>
                  )}
                  {detailOrder.returnRequest?.requestedAt && (
                    <div className="text-sm text-orange-800 mb-1">
                      <span className="font-medium">Requested:</span> {formatDate(detailOrder.returnRequest.requestedAt)}
                    </div>
                  )}
                  {detailOrder.returnNotes && (
                    <div className="text-sm text-orange-800">
                      <span className="font-medium">Notes:</span> {detailOrder.returnNotes}
                    </div>
                  )}
                </div>
              )}

              {detailOrder.items && detailOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {detailOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.name || item.name || 'Product'}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {typeof detailOrder.shippingAddress === 'string' 
                        ? detailOrder.shippingAddress 
                        : `${detailOrder.shippingAddress.addressLine1}, ${detailOrder.shippingAddress.city}, ${detailOrder.shippingAddress.state} - ${detailOrder.shippingAddress.pincode}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Supplier E-Signature</h2>
              <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Your e-signature will be recorded for issuing invoices/credit notes to customers</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Legal Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="Enter your store name"
              />
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-900">Generated E-Signature</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-3xl font-handwriting text-gray-700 italic mb-4" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                {storeName}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Want to change the signature?</span>
                <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Change
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSignatureModal(false)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold text-lg"
            >
              Submit Signature
            </button>
          </div>
        </div>
      )}

      {/* Scan Barcoded Packets Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Scan Barcoded Packets</h2>
              <button onClick={() => setShowScanModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Why use Barcoded Packets */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-4">
                <Package size={48} className="text-pink-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Why use Barcoded Packets?</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p>Barcoded packets are tamperproof and protect the shipments from fraud.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                        <rect x="2" y="6" width="4" height="12" fill="currentColor"/>
                        <rect x="7" y="6" width="2" height="12" fill="currentColor"/>
                        <rect x="10" y="6" width="4" height="12" fill="currentColor"/>
                        <rect x="15" y="6" width="2" height="12" fill="currentColor"/>
                        <rect x="18" y="6" width="4" height="12" fill="currentColor"/>
                      </svg>
                      <p>It's mandatory to scan the AWB & the QR code before dispatching the shipment to be eligible to raise RTO and Customer Return.</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-20 bg-red-600 rounded-lg flex items-center justify-center text-white">
                    <PlayCircle size={40} />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">How to Purchase<br/>and Scan</p>
                </div>
              </div>
            </div>

            {/* 2D Scanner Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-700">
                To scan the packets using your Desktop/Laptop, a 2D scanning device that supports scanning of Barcode and QR Code will be needed
              </p>
            </div>

            {/* Authorised Vendors */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-4">Authorised Vendors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Parin Polymers', location: 'Chandigarh', sizes: 9, price: '0.84', size: '6.5x8 inch' },
                  { name: 'Euphoria Packaging', location: 'Ahmedabad', sizes: 15, price: '0.84', size: '6.5x8 inch' },
                  { name: 'Global Parachem', location: 'Ghaziabad', sizes: 7, price: '0.84', size: '6.5x8 inch' },
                  { name: 'Shri Anand Polymers', location: 'Gurgaon', sizes: 9, price: '0.89', size: '6.5x8 inch' },
                  { name: 'PicknPack', location: 'New Delhi', sizes: 16, price: '0.86', size: '6.5x8 inch' },
                  { name: 'Pacfo', location: 'Surat', sizes: 11, price: '0.88', size: '6.5x8 inch' }
                ].map((vendor, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{vendor.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>Location: {vendor.location}</p>
                      <p>Sizes available: {vendor.sizes}</p>
                      <p>Price: Rs {vendor.price} per packet ({vendor.size})</p>
                    </div>
                    <button className="w-full bg-white border-2 border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 font-medium">
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Orders Data Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Download Orders Data</h2>
              <button onClick={() => setShowDownloadModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                Download Orders data here. For tax invoice, please use the Downloads option in Payments tab
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Download Orders Data</h3>
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                  <Calendar size={18} />
                  Select Date Range
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">It might take some time to generate the file</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">EXPORTED FILES</h3>
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                <p>No file yet.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowDownloadModal(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Buy Barcoded Packets Modal (Vendor List) */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Scan Barcoded Packets</h2>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Why use section */}
            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="text-purple-600" size={20} />
                Why use Barcoded Packets?
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Shield size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p>Barcoded packets are tamperproof and protect the shipments from fraud.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Package size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p>It's mandatory to scan the AWB & the QR code before dispatching the shipment to be eligible to raise RTO and Customer Return.</p>
                </div>
              </div>
              
              {/* Video placeholder */}
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-red-600 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <PlayCircle size={40} className="text-red-600" />
                    </div>
                    <p className="text-sm font-medium">How to Purchase<br />and Scan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanner requirement notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                To scan the packets using your Desktop/Laptop, a 2D scanning device that supports scanning of Barcode and QR Code will be needed
              </p>
            </div>

            {/* Authorised Vendors */}
            <h3 className="font-bold text-lg text-gray-900 mb-4">Authorised Vendors</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Vendor 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Parin Polymers</h4>
                <p className="text-sm text-gray-600 mb-1">📍 Chandigarh</p>
                <p className="text-sm text-gray-600 mb-1">📦 9 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.84 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>

              {/* Vendor 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Euphoria Packaging</h4>
                <p className="text-sm text-gray-600 mb-1">📍 Ahmedabad</p>
                <p className="text-sm text-gray-600 mb-1">📦 15 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.84 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>

              {/* Vendor 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Global Parachem</h4>
                <p className="text-sm text-gray-600 mb-1">📍 Ghaziabad</p>
                <p className="text-sm text-gray-600 mb-1">📦 7 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.84 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>

              {/* Vendor 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Shri Anand Polymers</h4>
                <p className="text-sm text-gray-600 mb-1">📍 Gurgaon</p>
                <p className="text-sm text-gray-600 mb-1">📦 9 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.89 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>

              {/* Vendor 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">PicknPack</h4>
                <p className="text-sm text-gray-600 mb-1">📍 New Delhi</p>
                <p className="text-sm text-gray-600 mb-1">📦 16 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.86 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>

              {/* Vendor 6 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Pacfo</h4>
                <p className="text-sm text-gray-600 mb-1">📍 Surat</p>
                <p className="text-sm text-gray-600 mb-1">📦 11 sizes</p>
                <p className="text-lg font-bold text-gray-900 mb-3">₹0.88 <span className="text-sm font-normal text-gray-500">onwards</span></p>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Details Modal (Step by Step Interface) */}
      {showScanDetailsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowScanDetailsModal(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <div className="text-sm text-gray-500">Orders &gt; Scan Barcoded Packets</div>
                  <h2 className="text-2xl font-bold text-gray-900">Barcoded Packet Scan</h2>
                </div>
              </div>
              <button className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium">
                Buy Barcoded Packets
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Why use */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Why use Barcoded Packets ?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm">Barcoded packets are tamperproof and protects the shipments from fraud</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm">Enjoy up to 100% approval on RTO Claims for shipments scanned and shipped in Barcoded packets</p>
                    </div>
                  </div>
                </div>

                {/* How to Scan */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">How to Scan Barcoded Packets ?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm">Scan the AWB barcode and packet QR using any scanning device on the laptop/computer</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm">Complete the mandatory linking of AWB & Barcoded packet QR by submitting the scan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanning Steps */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 gap-8 items-start">
                    {/* Step 1 */}
                    <div>
                      <div className="mb-4">
                        <div className="inline-block bg-white rounded-lg px-3 py-1 text-sm font-semibold text-gray-900 mb-2">
                          Step 1
                        </div>
                        <label className="block text-sm font-medium text-purple-600 mb-2">AWB Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Scan/Type AWB Number"
                            className="w-full px-4 py-3 pr-10 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>Don't have scanning device? try</span>
                        <button className="text-purple-600 font-semibold hover:underline">Scan with Mobile</button>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div>
                      <div className="mb-4">
                        <div className="inline-block bg-gray-300 rounded-lg px-3 py-1 text-sm font-semibold text-gray-500 mb-2">
                          Step 2
                        </div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Packet ID</label>
                        <div className="relative">
                          <input
                            type="text"
                            disabled
                            className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-6">
                    <button className="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
                      Submit
                    </button>
                  </div>

                  {/* Re-link Packet */}
                  <div className="mt-6 text-right">
                    <span className="text-sm text-gray-600">To change the damaged packet, use </span>
                    <button className="text-purple-600 font-semibold text-sm hover:underline">Re-link Packet</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
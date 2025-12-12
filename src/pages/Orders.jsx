import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import adminService from '../services/adminService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching orders...');
      const response = await adminService.getAllOrders();
      console.log('📦 Orders API Response:', response);
      
      // Extract orders from response - check multiple possible locations
      let ordersData = [];
      if (response.data?.data?.orders) {
        ordersData = response.data.data.orders;
      } else if (response.data?.orders) {
        ordersData = response.data.orders;
      } else if (response.orders) {
        ordersData = response.orders;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (Array.isArray(response)) {
        ordersData = response;
      }
      
      console.log('📦 Orders Data:', ordersData);
      console.log('📦 Total Orders:', ordersData.length);
      setOrders(ordersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      console.error('❌ Error fetching orders:', err);
      console.error('❌ Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
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
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = orders.filter(order => {
    const orderId = order.orderId || order.orderNumber || order._id || '';
    const customerName = order.user?.name || '';
    const customerEmail = order.user?.email || '';
    return orderId.toLowerCase().includes(search.toLowerCase()) ||
           customerName.toLowerCase().includes(search.toLowerCase()) ||
           customerEmail.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-xl">Loading orders...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-900">Orders Management</h1>
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow w-full max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <Card className="border border-purple-200 shadow-lg p-8 bg-white text-center">
            <p className="text-purple-600 text-lg">No orders found</p>
          </Card>
        ) : (
          <Card className="border border-purple-200 shadow-lg overflow-hidden bg-white">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] w-full">
                <thead style={{ background: '#9E1CF0' }} className="text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Order ID</th>
                    <th className="px-4 py-4 text-left font-semibold">Customer</th>
                    <th className="px-4 py-4 text-left font-semibold">Date</th>
                    <th className="px-4 py-4 text-left font-semibold">Amount</th>
                    <th className="px-4 py-4 text-left font-semibold">Status</th>
                    <th className="px-4 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id || order.orderId} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4 font-bold text-purple-600">{order.orderId || order.orderNumber || order._id?.slice(-8)}</td>
                      <td className="px-4 py-4">{order.user?.name || 'N/A'}</td>
                      <td className="px-4 py-4">{formatDate(order.createdAt || order.placedAt)}</td>
                      <td className="px-4 py-4 font-semibold">₹{((order.pricing?.total || order.totalAmount || 0)).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-normal capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button size="sm" onClick={() => setDetailOrder(order)} className="text-purple-600 px-4 py-1 font-semibold hover:bg-purple-100">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Detail Modal */}
        {detailOrder && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-purple-200 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setDetailOrder(null)} className="absolute top-3 right-3 text-xl text-purple-600 font-bold">&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Order Details</h2>
              <div className="space-y-3">
                <div><span className="font-semibold">Order ID:</span> {detailOrder.orderId || detailOrder.orderNumber || detailOrder._id}</div>
                <div><span className="font-semibold">Customer:</span> {detailOrder.user?.name || 'N/A'}</div>
                <div><span className="font-semibold">Email:</span> {detailOrder.user?.email || 'N/A'}</div>
                <div><span className="font-semibold">Phone:</span> {detailOrder.shippingAddress?.phone || 'N/A'}</div>
                <div><span className="font-semibold">Date:</span> {formatDate(detailOrder.createdAt || detailOrder.placedAt)}</div>
                <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded capitalize ${getStatusColor(detailOrder.status)}`}>{detailOrder.status}</span></div>
                <div><span className="font-semibold">Total Amount:</span> ₹{((detailOrder.pricing?.total || detailOrder.totalAmount || 0)).toLocaleString('en-IN')}</div>
                <div><span className="font-semibold">Payment:</span> {detailOrder.payment?.method || detailOrder.paymentMethod || 'N/A'}</div>
                {detailOrder.shippingAddress && (
                  <div>
                    <span className="font-semibold">Shipping Address:</span>
                    <div className="mt-1 text-sm text-gray-600">
                      {detailOrder.shippingAddress.fullName}<br/>
                      {detailOrder.shippingAddress.addressLine1}<br/>
                      {detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.state} - {detailOrder.shippingAddress.pincode}
                    </div>
                  </div>
                )}
                {detailOrder.items && detailOrder.items.length > 0 && (
                  <div>
                    <span className="font-semibold">Items:</span>
                    <ul className="mt-2 space-y-2">
                      {detailOrder.items.map((item, idx) => (
                        <li key={idx} className="bg-purple-50 p-2 rounded">
                          {item.product?.name || 'Product'} x {item.quantity} - ₹{(item.price * item.quantity).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {detailOrder.shippingAddress && (
                  <div>
                    <span className="font-semibold">Shipping Address:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {typeof detailOrder.shippingAddress === 'string' 
                        ? detailOrder.shippingAddress 
                        : `${detailOrder.shippingAddress.addressLine1}, ${detailOrder.shippingAddress.city}, ${detailOrder.shippingAddress.state} - ${detailOrder.shippingAddress.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;

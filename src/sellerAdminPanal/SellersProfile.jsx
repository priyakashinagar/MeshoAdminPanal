
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/common/Card';
import sellerService from '../services/sellerService';
import productService from '../services/productService';
import orderService from '../services/orderService';

export default function SellersProfile() {
  const { user } = useSelector(state => state.auth);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch seller profile
      const profileResponse = await sellerService.getProfile();
      const sellerData = profileResponse.seller || profileResponse;
      setSeller(sellerData);

      // Fetch seller's products
      if (user?.sellerId || sellerData?._id) {
        const sellerId = user?.sellerId || sellerData?._id;
        const productsResponse = await productService.getProductsBySeller(sellerId);
        setProducts(productsResponse.data || []);
      }

      // Fetch seller's orders
      const ordersResponse = await sellerService.getOrders({ limit: 50 });
      const ordersData = ordersResponse.orders || ordersResponse.data || [];
      setOrders(ordersData);

    } catch (err) {
      console.error('Error fetching seller data:', err);
      setError(err.message || 'Failed to fetch seller data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate earnings from delivered orders
  const calculateEarnings = () => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const monthlyEarnings = {};
    
    deliveredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const amount = order.pricing?.total || order.totalAmount || 0;
      monthlyEarnings[monthYear] = (monthlyEarnings[monthYear] || 0) + amount;
    });

    return Object.entries(monthlyEarnings).map(([month, amount]) => ({ month, amount }));
  };

  const earnings = calculateEarnings();
  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading seller profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No seller profile found. Please complete your seller registration.
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4">
      <h2 className="text-2xl font-bold mb-2">My Seller Profile</h2>
      <p className="text-purple-700 mb-6">View your store info, products, and earnings.</p>
      <div className="w-full mx-auto px-2 sm:px-0">
        {/* Store Header */}
        <div className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {seller.shopName?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{seller.shopName || 'My Store'}</h3>
              <p className="text-white/80">{seller.user?.name || user?.name || 'Seller'}</p>
              <p className="text-sm text-white/60 mt-1">
                {seller.isVerified ? '✓ Verified Seller' : '⏳ Verification Pending'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'info' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('info')}
          >Info</button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'products' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('products')}
          >Products ({products.length})</button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'orders' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('orders')}
          >Orders ({orders.length})</button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold shadow transition-colors ${tab === 'earnings' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-100 text-purple-700'}`}
            onClick={() => setTab('earnings')}
          >Earnings</button>
        </div>

        {tab === 'info' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Store Name</label>
                  <div className="text-purple-900 text-lg font-semibold">{seller.shopName || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Business Type</label>
                  <div className="text-purple-900 capitalize">{seller.businessType || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Email</label>
                  <div className="text-purple-900">{seller.user?.email || user?.email || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Phone</label>
                  <div className="text-purple-900">{seller.user?.phone || user?.phone || 'N/A'}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-purple-600 font-medium mb-1">Business Address</label>
                  <div className="text-purple-900">
                    {seller.businessAddress ? 
                      `${seller.businessAddress.addressLine1 || ''}, ${seller.businessAddress.city || ''}, ${seller.businessAddress.state || ''} - ${seller.businessAddress.pincode || ''}` 
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">KYC Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    seller.kycStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    seller.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {seller.kycStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Store Rating</label>
                  <div className="text-purple-900 flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold">{seller.ratings?.average?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-500">({seller.ratings?.count || 0} reviews)</span>
                  </div>
                </div>
              </div>
              {seller.description && (
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Store Description</label>
                  <div className="text-purple-900">{seller.description}</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {tab === 'products' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">My Products</h3>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products added yet. Add your first product!</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full text-left">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">MRP</th>
                      <th className="px-4 py-3 text-left">Stock</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr key={product._id} className="border-b border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3 font-bold text-purple-700">₹{product.price?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">₹{product.mrp?.toLocaleString()}</td>
                        <td className="px-4 py-3">{product.stock?.quantity || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {tab === 'orders' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">My Orders</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet. Orders from your products will appear here!</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full text-left">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3 font-mono">{order.orderId || order._id?.slice(-8)}</td>
                        <td className="px-4 py-3">{order.user?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{order.items?.[0]?.name || 'N/A'}</td>
                        <td className="px-4 py-3 font-bold text-purple-700">₹{(order.pricing?.total || order.totalAmount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs capitalize ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
        {tab === 'earnings' && (
          <Card className="p-6 border border-purple-100 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Earnings</h3>
            <div className="flex flex-row items-center gap-6 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow flex flex-row items-center justify-center h-12 min-w-[200px] px-8 gap-3">
                <span className="text-lg font-semibold">Total Earnings</span>
                <span className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
            {earnings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No earnings yet. Earnings from delivered orders will appear here!</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full text-left">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-left">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((item, idx) => (
                      <tr key={idx} className="border-b border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3">{item.month}</td>
                        <td className="px-4 py-3 font-bold text-purple-700">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

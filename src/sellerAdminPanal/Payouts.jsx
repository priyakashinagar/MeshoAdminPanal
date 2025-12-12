import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, IndianRupee, Download, Calendar } from 'lucide-react';
import sellerService from '../services/sellerService';
import adminService from '../services/adminService';

export default function Payouts() {
  const [wallet, setWallet] = useState(null);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ready'); // ready, history
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Check if user is admin or seller
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role;
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Auto-select all pending orders
    if (pendingPayouts.length > 0) {
      setSelectedOrders(pendingPayouts.map(o => o._id));
    }
  }, [pendingPayouts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Admin fetches all sellers' data
        const [pendingRes, historyRes, walletRes] = await Promise.all([
          adminService.getAllPendingPayouts({ limit: 50 }),
          adminService.getAllPayoutHistory({ limit: 20 }),
          adminService.getAllWallets()
        ]);
        
        console.log('💰 Admin Wallet Response:', walletRes);
        console.log('⏳ Admin Pending Response:', pendingRes);
        console.log('📜 Admin History Response:', historyRes);
        
        setWallet(walletRes.data?.summary || null);
        setPendingPayouts(pendingRes.data?.orders || []);
        setPayoutHistory(historyRes.data?.transactions || []);
      } else {
        // Seller fetches their own data
        const [walletRes, pendingRes, historyRes] = await Promise.all([
          sellerService.getWallet(),
          sellerService.getPendingPayouts(),
          sellerService.getPayoutHistory({ limit: 20 })
        ]);
        
        console.log('💰 Wallet Response:', walletRes);
        console.log('⏳ Pending Response:', pendingRes);
        console.log('📜 History Response:', historyRes);
        
        setWallet(walletRes.wallet || walletRes);
        setPendingPayouts(pendingRes.orders || []);
        setPayoutHistory(historyRes.transactions || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch payout data');
      console.error('❌ Error fetching payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      if (selectedOrders.length === 0) {
        alert('Please select orders for payout');
        return;
      }
      
      await sellerService.requestPayout({ orderIds: selectedOrders });
      alert('Payout request submitted successfully!');
      setSelectedOrders([]);
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to request payout');
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === pendingPayouts.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pendingPayouts.map(o => o._id));
    }
  };

  const selectedAmount = pendingPayouts
    .filter(o => selectedOrders.includes(o._id))
    .reduce((sum, o) => sum + (o.earnings?.netSellerEarning || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-purple-600 text-xl">Loading payouts...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-2 text-purple-900">Payouts</h2>
        <p className="text-purple-700 mb-6">Manage your payout requests and transaction history.</p>

        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Wallet Cards */}
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 rounded-xl p-5 shadow-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
              </div>
              <p className="text-3xl font-bold text-yellow-700 flex items-center">
                <IndianRupee size={24} />{wallet.pendingAmount?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-yellow-600 mt-1">7-day hold period</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5 shadow-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">Ready to Withdraw</p>
              </div>
              <p className="text-3xl font-bold text-blue-700 flex items-center">
                <IndianRupee size={24} />{wallet.upcomingPayout?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">Available now</p>
            </div>

            <div className="bg-green-50 rounded-xl p-5 shadow-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <p className="text-sm text-green-700 font-medium">Completed</p>
              </div>
              <p className="text-3xl font-bold text-green-700 flex items-center">
                <IndianRupee size={24} />{wallet.completedPayout?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">Total received</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 shadow-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={20} className="text-purple-600" />
                <p className="text-sm text-purple-700 font-medium">Total Earnings</p>
              </div>
              <p className="text-3xl font-bold text-purple-700 flex items-center">
                <IndianRupee size={24} />{wallet.totalEarnings?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-purple-600 mt-1">Lifetime earnings</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-purple-200">
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'ready' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Ready to Withdraw ({pendingPayouts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'history' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Payout History
          </button>
        </div>

        {/* Ready to Withdraw Tab */}
        {activeTab === 'ready' && (
          <div className="bg-white rounded-lg shadow-lg border border-purple-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-purple-900">Orders Ready for Payout</h3>
                {pendingPayouts.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Selected Amount</p>
                      <p className="text-xl font-bold text-green-600">₹{selectedAmount.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={handleRequestPayout}
                      disabled={selectedOrders.length === 0}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={18} />
                      Request Payout ({selectedOrders.length})
                    </button>
                  </div>
                )}
              </div>
              {pendingPayouts.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No orders ready for payout</p>
                  <p className="text-sm text-gray-400 mt-2">Orders will appear here after 7 days of delivery</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: '700px' }}>
                    <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedOrders.length === pendingPayouts.length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Delivered On</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Net Earning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayouts.map(order => (
                        <tr 
                          key={order._id} 
                          className={`border-b border-purple-100 hover:bg-purple-50 transition-colors ${selectedOrders.includes(order._id) ? 'bg-purple-50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order._id)}
                              onChange={() => toggleOrderSelection(order._id)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-purple-700">#{order.orderId?.slice(-8)}</td>
                          <td className="px-4 py-3 text-sm">{order.items?.[0]?.product?.name || order.items?.[0]?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">₹{order.earnings?.netSellerEarning?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payout History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-lg border border-purple-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-4">Transaction History</h3>
              {payoutHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No payout history</p>
                  <p className="text-sm text-gray-400 mt-2">Your completed payouts will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payoutHistory.map(payout => (
                    <div key={payout._id} className="border border-purple-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-purple-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-sm text-purple-700 font-semibold">{payout.transactionId}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(payout.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                          payout.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          payout.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payout.status === 'completed' && '✓'}
                          {payout.status === 'processing' && '⏳'}
                          {payout.status === 'failed' && '✗'}
                          {payout.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs">Orders</p>
                          <p className="font-semibold text-purple-700">{payout.breakdown?.totalOrders || payout.orders?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Total Sales</p>
                          <p className="font-semibold">₹{payout.breakdown?.totalSales?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Commission</p>
                          <p className="font-semibold text-red-600">-₹{payout.breakdown?.totalCommission?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">GST + Shipping</p>
                          <p className="font-semibold text-red-600">
                            -₹{((payout.breakdown?.totalTax || 0) + (payout.breakdown?.totalShipping || 0)).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-gray-600 text-xs">Net Amount</p>
                          <p className="font-bold text-green-600 text-lg flex items-center">
                            <IndianRupee size={16} />
                            {payout.amount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {payout.paymentMode && (
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <p className="text-xs text-gray-600">Payment Mode: <span className="font-semibold text-purple-700">{payout.paymentMode.toUpperCase()}</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

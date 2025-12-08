import React, { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, Percent, Package } from 'lucide-react';
import sellerService from '../services/sellerService';

export default function Earnings() {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const breakdownRes = await sellerService.getEarningsBreakdown();
      
      console.log('📊 Breakdown Response:', breakdownRes);
      
      setBreakdown({
        ...(breakdownRes.breakdown || breakdownRes),
        orders: breakdownRes.orders || []
      });
      
      console.log('✅ State updated - Breakdown:', breakdownRes.breakdown || breakdownRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch earnings data');
      console.error('❌ Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-purple-600 text-xl">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-2 text-purple-900">Earnings & Payouts</h2>
        <p className="text-purple-700 mb-6">Track your earnings, commissions, and payout status.</p>

        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {breakdown && (
          <div className="bg-white rounded-lg shadow border border-purple-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-purple-900 mb-4">Earnings Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-purple-700">₹{breakdown.totalSales?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Platform Commission ({breakdown.averageCommissionPercent}%)</p>
                <p className="text-xl font-bold text-red-600">-₹{breakdown.totalCommission?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">GST (18% on commission)</p>
                <p className="text-xl font-bold text-red-600">-₹{breakdown.totalTax?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Charges</p>
                <p className="text-xl font-bold text-red-600">-₹{breakdown.totalShipping?.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-purple-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-700">Net Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{breakdown.netEarnings?.toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">From {breakdown.totalOrders} delivered orders</p>
            </div>
          </div>
        )}

        {breakdown && (
          <div className="bg-white rounded-lg shadow border border-purple-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-4">Recent Orders (Delivered)</h3>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '800px' }}>
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Product Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Commission</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">GST</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Shipping</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Net Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.orders?.slice(0, 10).map(order => (
                      <tr key={order._id} className="border-b border-purple-100 hover:bg-purple-50">
                        <td className="px-4 py-3 text-sm font-mono">#{order.orderId?.slice(-8)}</td>
                        <td className="px-4 py-3 text-sm font-semibold">₹{order.pricing?.itemsTotal?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600">-₹{order.earnings?.platformCommission?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600">-₹{order.earnings?.totalTax?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600">-₹{order.earnings?.shippingCharges?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">₹{order.earnings?.netSellerEarning?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

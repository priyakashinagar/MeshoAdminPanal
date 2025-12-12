import React, { useState, useEffect } from 'react';
import { Store, Package, ShoppingCart, DollarSign, TrendingUp, Eye, ToggleLeft, ToggleRight, Search, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../services/adminService';
import AdminLayout from '../components/layout/AdminLayout';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    fetchSellers();
  }, [pagination.page]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      console.log('🏪 Fetching seller management data...');

      const response = await adminService.getSellerManagement({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });

      console.log('🏪 Seller Management Response:', response);

      let sellersData = [];
      let total = 0;

      if (response.data?.sellers) {
        sellersData = response.data.sellers;
        total = response.data.total || sellersData.length;
      } else if (response.sellers) {
        sellersData = response.sellers;
        total = response.total || sellersData.length;
      } else if (response.data?.data) {
        sellersData = response.data.data;
        total = response.data.total || sellersData.length;
      } else if (Array.isArray(response.data)) {
        sellersData = response.data;
        total = sellersData.length;
      } else if (Array.isArray(response)) {
        sellersData = response;
        total = sellersData.length;
      }

      setSellers(sellersData);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('❌ Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (sellerId, currentStatus) => {
    try {
      await adminService.updateSellerStatus(sellerId, !currentStatus);
      fetchSellers();
    } catch (error) {
      console.error('❌ Error updating seller status:', error);
      alert('Failed to update seller status');
    }
  };

  const viewSellerDetails = async (seller) => {
    try {
      const response = await adminService.getSellerById(seller._id);
      setSelectedSeller(response.data?.seller || response.seller || seller);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('❌ Error fetching seller details:', error);
      setSelectedSeller(seller);
      setShowDetailsModal(true);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (isActive, isVerified, kycStatus) => {
    if (!isActive) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3.5 h-3.5" />
        Inactive
      </span>;
    }
    if (!isVerified) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3.5 h-3.5" />
        Unverified
      </span>;
    }
    if (kycStatus === 'approved') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3.5 h-3.5" />
        Active & Verified
      </span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      Active
    </span>;
  };

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all sellers on the platform</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by shop name, seller name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={fetchSellers}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Seller Info</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Business Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                      <p className="mt-3 text-gray-600">Loading sellers...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No sellers found</p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {seller.shopName?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div className="font-medium text-gray-900">{seller.shopName || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{seller.userInfo?.name || seller.user?.name || 'N/A'}</div>
                        <div className="text-gray-500">{seller.userInfo?.email || seller.user?.email || 'N/A'}</div>
                        <div className="text-gray-500">{seller.userInfo?.phone || seller.user?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {seller.businessType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="w-5 h-5 text-purple-600 mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{seller.productCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingCart className="w-5 h-5 text-blue-600 mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{seller.orderCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <DollarSign className="w-5 h-5 text-green-600 mb-1" />
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{seller.totalRevenue?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(seller.isActive, seller.isVerified, seller.kycStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewSellerDetails(seller)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(seller._id, seller.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            seller.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={seller.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {seller.isActive ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Details Modal */}
      {showDetailsModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">{selectedSeller.shopName}</h3>
              <p className="text-purple-100 text-sm mt-1">Seller ID: {selectedSeller._id}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Products</p>
                      <p className="text-2xl font-bold text-purple-800 mt-1">{selectedSeller.productCount || 0}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Orders</p>
                      <p className="text-2xl font-bold text-blue-800 mt-1">{selectedSeller.orderCount || 0}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Revenue</p>
                      <p className="text-2xl font-bold text-green-800 mt-1">₹{selectedSeller.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Rating</p>
                      <p className="text-2xl font-bold text-orange-800 mt-1">{selectedSeller.avgRating?.toFixed(1) || 'N/A'}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedSeller.userInfo?.name || selectedSeller.user?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedSeller.userInfo?.email || selectedSeller.user?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedSeller.userInfo?.phone || selectedSeller.user?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Business Type:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedSeller.businessType || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">GST:</span>
                      <span className="ml-2 font-mono font-medium text-gray-900">{selectedSeller.gstNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">PAN:</span>
                      <span className="ml-2 font-mono font-medium text-gray-900">{selectedSeller.panNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Account Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Active Status:</span>
                    <span className="ml-2">{selectedSeller.isActive ? 
                      <span className="text-green-600 font-semibold">Active</span> : 
                      <span className="text-red-600 font-semibold">Inactive</span>
                    }</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Verified:</span>
                    <span className="ml-2">{selectedSeller.isVerified ? 
                      <span className="text-green-600 font-semibold">Yes</span> : 
                      <span className="text-yellow-600 font-semibold">No</span>
                    }</span>
                  </div>
                  <div>
                    <span className="text-gray-600">KYC Status:</span>
                    <span className="ml-2 font-semibold text-gray-900">{selectedSeller.kycStatus || 'pending'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedSeller._id, selectedSeller.isActive)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSeller.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedSeller.isActive ? 'Deactivate Seller' : 'Activate Seller'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default SellerManagement;

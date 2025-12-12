import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import adminService from '../services/adminService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching users and sellers...');
      
      const [usersResponse, sellersResponse] = await Promise.all([
        adminService.getAllUsers({ role: 'user' }),
        adminService.getAllSellers()
      ]);
      
      console.log('👥 Users Response:', usersResponse);
      console.log('👥 Sellers Response:', sellersResponse);
      
      // Extract users data
      const usersData = Array.isArray(usersResponse.data) 
        ? usersResponse.data 
        : usersResponse.data?.users || usersResponse.users || [];
      
      // Extract sellers data
      const sellersData = Array.isArray(sellersResponse.data) 
        ? sellersResponse.data 
        : sellersResponse.data?.sellers || sellersResponse.sellers || [];
      
      setUsers(usersData);
      setSellers(sellersData);
      console.log('✅ Users:', usersData.length, '| Sellers:', sellersData.length);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('❌ Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      setUpdating(true);
      await adminService.updateUserStatus(userId, !isActive);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleSellerStatus = async (sellerId, isActive) => {
    try {
      setUpdating(true);
      await adminService.updateSellerStatus(sellerId, !isActive);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update seller status');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifySeller = async (sellerId, approved) => {
    try {
      setUpdating(true);
      await adminService.verifySeller(sellerId, { approved });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify seller');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewProfile = (item) => {
    setProfile(item);
  };

  const closeProfile = () => setProfile(null);

  const getKycStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'submitted': 'bg-blue-100 text-blue-700',
      'under_review': 'bg-purple-100 text-purple-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSellers = sellers.filter(seller =>
    seller.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    seller.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    seller.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-xl">Loading users and sellers...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Users & Sellers Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage buyers and suppliers on the platform</p>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow w-full max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder={activeTab === 'users' ? 'Search users by name, email, phone...' : 'Search sellers by shop name, name, email...'}
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

        {/* Tabs */}
        <div className="flex gap-4 border-b border-purple-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-6 font-semibold text-lg transition-all ${
              activeTab === 'users' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👥 All Users (Buyers) <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">{users.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`pb-3 px-6 font-semibold text-lg transition-all ${
              activeTab === 'sellers' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🏪 All Sellers (Suppliers) <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">{sellers.length}</span>
          </button>
        </div>

        {/* Users Stats Cards */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">{users.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Active Users</p>
              <p className="text-3xl font-bold text-green-800 mt-2">{users.filter(u => u.isActive !== false).length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">Inactive Users</p>
              <p className="text-3xl font-bold text-red-800 mt-2">{users.filter(u => u.isActive === false).length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Search Results</p>
              <p className="text-3xl font-bold text-purple-800 mt-2">{filteredUsers.length}</p>
            </div>
          </div>
        )}

        {/* Sellers Stats Cards */}
        {activeTab === 'sellers' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Total Sellers</p>
              <p className="text-3xl font-bold text-purple-800 mt-2">{sellers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">KYC Approved</p>
              <p className="text-3xl font-bold text-green-800 mt-2">{sellers.filter(s => s.kycStatus === 'approved').length}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-600 font-medium">Pending KYC</p>
              <p className="text-3xl font-bold text-yellow-800 mt-2">{sellers.filter(s => s.kycStatus === 'submitted' || s.kycStatus === 'pending').length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Active Sellers</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">{sellers.filter(s => s.isActive !== false).length}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100 w-full">
            <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="min-w-[600px] w-full text-left table-fixed">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold w-[18%]">Name</th>
                    <th className="px-4 py-4 text-left font-semibold w-[22%]">Email</th>
                    <th className="px-4 py-4 text-left font-semibold w-[12%]">Phone</th>
                    <th className="px-4 py-4 text-left font-semibold w-[10%]">Role</th>
                    <th className="px-4 py-4 text-left font-semibold w-[10%]">Status</th>
                    <th className="px-4 py-4 text-left font-semibold w-[12%]">Joined</th>
                    <th className="px-4 py-4 text-left font-semibold w-[16%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <tr key={user._id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors"> 
                        <td className="px-4 py-4 font-medium text-purple-900">{user.name || 'N/A'}</td>
                        <td className="px-4 py-4 truncate" title={user.email}>{user.email}</td>
                        <td className="px-4 py-4">{user.phone || '-'}</td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 capitalize font-medium">
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3 items-center">
                            <button 
                              onClick={() => handleViewProfile(user)}
                              className="text-purple-600 font-bold hover:underline text-sm"
                            >
                              Detail
                            </button>
                            <button 
                              onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                              disabled={updating}
                              className={`font-bold hover:underline text-sm ${user.isActive !== false ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {user.isActive !== false ? 'Block' : 'Unblock'}
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
        )}

        {/* Sellers Table */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100 w-full">
            <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="min-w-[700px] w-full text-left table-fixed">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold w-[15%]">Seller Name</th>
                    <th className="px-4 py-4 text-left font-semibold w-[15%]">Shop Name</th>
                    <th className="px-4 py-4 text-left font-semibold w-[18%]">Email</th>
                    <th className="px-4 py-4 text-left font-semibold w-[12%]">Phone</th>
                    <th className="px-4 py-4 text-left font-semibold w-[10%]">KYC</th>
                    <th className="px-4 py-4 text-left font-semibold w-[10%]">Status</th>
                    <th className="px-4 py-4 text-left font-semibold w-[20%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No sellers found</td></tr>
                  ) : (
                    filteredSellers.map((seller, idx) => (
                      <tr key={seller._id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors"> 
                        <td className="px-4 py-4 font-medium text-purple-900">{seller.user?.name || 'N/A'}</td>
                        <td className="px-4 py-4 truncate" title={seller.shopName}>{seller.shopName || '-'}</td>
                        <td className="px-4 py-4 truncate" title={seller.user?.email}>{seller.user?.email || '-'}</td>
                        <td className="px-4 py-4">{seller.user?.phone || '-'}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${getKycStatusColor(seller.kycStatus)}`}>
                            {seller.kycStatus || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${seller.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {seller.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3 items-center">
                            <button 
                              onClick={() => handleViewProfile(seller)}
                              className="text-purple-600 font-bold hover:underline text-sm"
                            >
                              Detail
                            </button>
                            {seller.kycStatus === 'submitted' && (
                              <>
                                <button 
                                  onClick={() => handleVerifySeller(seller._id, true)}
                                  disabled={updating}
                                  className="text-green-600 font-bold hover:underline text-sm"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleVerifySeller(seller._id, false)}
                                  disabled={updating}
                                  className="text-red-600 font-bold hover:underline text-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleToggleSellerStatus(seller._id, seller.isActive)}
                              disabled={updating}
                              className={`font-bold hover:underline text-sm ${seller.isActive !== false ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {seller.isActive !== false ? 'Block' : 'Unblock'}
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
        )}

        {/* Profile Modal */}
        {profile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={closeProfile}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <button onClick={closeProfile} className="absolute top-4 right-4 text-2xl text-purple-600 hover:text-purple-800 font-bold">&times;</button>
              
              {profile.shopName ? (
                // Seller Profile
                <>
                  <h2 className="text-2xl font-bold mb-6 text-purple-700">🏪 Seller Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Shop Name:</span> 
                      <p className="text-gray-800">{profile.shopName}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Owner Name:</span> 
                      <p className="text-gray-800">{profile.user?.name || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Email:</span> 
                      <p className="text-gray-800">{profile.user?.email || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Phone:</span> 
                      <p className="text-gray-800">{profile.user?.phone || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Business Type:</span> 
                      <p className="text-gray-800 capitalize">{profile.businessType || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">GST Number:</span> 
                      <p className="text-gray-800">{profile.gstNumber || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">PAN Number:</span> 
                      <p className="text-gray-800">{profile.panNumber || '-'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">KYC Status:</span> 
                      <p>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm capitalize ${getKycStatusColor(profile.kycStatus)}`}>
                          {profile.kycStatus || 'pending'}
                        </span>
                      </p>
                    </div>
                    {profile.businessAddress && (
                      <div className="col-span-2 bg-purple-50 p-3 rounded-lg">
                        <span className="font-semibold text-purple-700">Business Address:</span>
                        <p className="text-gray-800 mt-1">
                          {profile.businessAddress.addressLine1}, {profile.businessAddress.city}, {profile.businessAddress.state} - {profile.businessAddress.pincode}
                        </p>
                      </div>
                    )}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Account Status:</span> 
                      <p>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${profile.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {profile.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-semibold text-purple-700">Verified:</span> 
                      <p>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${profile.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {profile.isVerified ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // User Profile
                <>
                  <h2 className="text-2xl font-bold mb-6 text-purple-700">👤 User Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Name:</span> 
                      <p className="text-gray-800">{profile.name || '-'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Email:</span> 
                      <p className="text-gray-800">{profile.email || '-'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Phone:</span> 
                      <p className="text-gray-800">{profile.phone || '-'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Role:</span> 
                      <p>
                        <span className="ml-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 capitalize">
                          {profile.role || 'user'}
                        </span>
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Account Status:</span> 
                      <p>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${profile.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {profile.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-700">Member Since:</span> 
                      <p className="text-gray-800">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;

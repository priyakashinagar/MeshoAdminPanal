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
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'sellers'
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, sellersResponse] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllSellers()
      ]);
      setUsers(usersResponse.data?.users || []);
      setSellers(sellersResponse.data?.sellers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive, type) => {
    try {
      setUpdating(true);
      if (type === 'user') {
        await adminService.updateUserStatus(id, !isActive);
      } else {
        await adminService.updateSellerStatus(id, !isActive);
      }
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifySeller = async (sellerId, status) => {
    try {
      setUpdating(true);
      await adminService.verifySeller(sellerId, { status });
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
    user.email?.toLowerCase().includes(search.toLowerCase())
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
          <div className="text-purple-600 text-xl">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-900">Users & Sellers</h1>
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow w-full max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search..."
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
            className={`pb-2 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`pb-2 px-4 font-semibold ${activeTab === 'sellers' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
          >
            Sellers ({sellers.length})
          </button>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <Card className="border border-purple-200 shadow-lg overflow-hidden bg-white">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] w-full">
                <thead style={{ background: '#9E1CF0' }} className="text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Name</th>
                    <th className="px-4 py-4 text-left font-semibold">Email</th>
                    <th className="px-4 py-4 text-left font-semibold">Phone</th>
                    <th className="px-4 py-4 text-left font-semibold">Role</th>
                    <th className="px-4 py-4 text-left font-semibold">Status</th>
                    <th className="px-4 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <tr key={user._id} className={`hover:bg-purple-50 transition-colors${idx === filteredUsers.length - 1 ? '' : ' border-b border-purple-200'}`}> 
                        <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.phone || '-'}</td>
                        <td className="px-4 py-3 capitalize">{user.role}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleToggleStatus(user._id, user.isActive, 'user')}
                            disabled={updating}
                            className={`px-4 py-1 font-semibold ${user.isActive !== false ? 'text-red-600' : 'text-green-600'}`}
                          >
                            {user.isActive !== false ? 'Deactivate' : 'Activate'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Sellers Table */}
        {activeTab === 'sellers' && (
          <Card className="border border-purple-200 shadow-lg overflow-hidden bg-white">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] w-full">
                <thead style={{ background: '#9E1CF0' }} className="text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Shop Name</th>
                    <th className="px-4 py-4 text-left font-semibold">Owner</th>
                    <th className="px-4 py-4 text-left font-semibold">Email</th>
                    <th className="px-4 py-4 text-left font-semibold">KYC Status</th>
                    <th className="px-4 py-4 text-left font-semibold">Status</th>
                    <th className="px-4 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No sellers found</td></tr>
                  ) : (
                    filteredSellers.map((seller, idx) => (
                      <tr key={seller._id} className={`hover:bg-purple-50 transition-colors${idx === filteredSellers.length - 1 ? '' : ' border-b border-purple-200'}`}> 
                        <td className="px-4 py-3 font-medium text-slate-900">{seller.shopName}</td>
                        <td className="px-4 py-3">{seller.user?.name || '-'}</td>
                        <td className="px-4 py-3">{seller.user?.email || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm capitalize ${getKycStatusColor(seller.kycStatus)}`}>
                            {seller.kycStatus || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${seller.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {seller.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            onClick={() => handleViewProfile(seller)}
                            className="bg-purple-100 text-purple-700 px-3 py-1 font-semibold"
                          >
                            View
                          </Button>
                          {seller.kycStatus === 'submitted' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleVerifySeller(seller._id, 'approved')}
                                disabled={updating}
                                className="bg-green-100 text-green-700 px-3 py-1 font-semibold"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleVerifySeller(seller._id, 'rejected')}
                                disabled={updating}
                                className="bg-red-100 text-red-700 px-3 py-1 font-semibold"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Seller Profile Modal */}
        {profile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button onClick={closeProfile} className="absolute top-3 right-3 text-xl text-purple-600 font-bold">&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Seller Profile</h2>
              <div className="space-y-3">
                <div><span className="font-semibold">Shop Name:</span> {profile.shopName}</div>
                <div><span className="font-semibold">Owner:</span> {profile.user?.name || '-'}</div>
                <div><span className="font-semibold">Email:</span> {profile.user?.email || '-'}</div>
                <div><span className="font-semibold">Phone:</span> {profile.user?.phone || '-'}</div>
                <div><span className="font-semibold">Business Type:</span> {profile.businessType || '-'}</div>
                <div><span className="font-semibold">GST Number:</span> {profile.gstNumber || '-'}</div>
                <div><span className="font-semibold">PAN Number:</span> {profile.panNumber || '-'}</div>
                {profile.businessAddress && (
                  <div>
                    <span className="font-semibold">Address:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.businessAddress.addressLine1}, {profile.businessAddress.city}, {profile.businessAddress.state} - {profile.businessAddress.pincode}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-semibold">KYC Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm capitalize ${getKycStatusColor(profile.kycStatus)}`}>
                    {profile.kycStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Verified:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${profile.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {profile.isVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;

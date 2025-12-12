import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Mail, Phone, MapPin, Loader2, AlertCircle, IndianRupee } from 'lucide-react';
import adminService from '../services/adminService';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      console.log('👥 Fetching customers...');
      const response = await adminService.getCustomers({ page, limit: 12, search: searchTerm });
      console.log('👥 Customers Response:', response);
      if (response.success || response.data) {
        const customersData = response.data?.users || response.data?.customers || [];
        const paginationData = response.data?.pagination || { page: 1, pages: 1, total: customersData.length };
        console.log('👥 Customers Data:', customersData);
        setCustomers(customersData);
        setPagination(paginationData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
      console.error('❌ Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, !currentStatus);
      fetchCustomers(pagination.page);
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading customers...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && customers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <Button onClick={() => fetchCustomers(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Customers Management</h1>
          <p className="text-purple-600 mt-2">Total Customers: {pagination.total}</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600 ml-4" />}
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-600 text-lg">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <Card key={customer._id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-purple-900">{customer.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleStatusToggle(customer._id, customer.isActive)} 
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${customer.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {customer.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Mail size={16} className="text-pink-600" />
                    <a href={`mailto:${customer.email}`} className="hover:text-pink-600">{customer.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Phone size={16} className="text-pink-600" />
                    <span>{customer.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <MapPin size={16} className="text-pink-600" />
                    <span>{customer.address?.city || 'N/A'}, {customer.address?.state || ''}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-200 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-purple-600">Orders</p>
                    <p className="text-lg font-bold text-pink-600">{customer.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Total Spent</p>
                    <p className="text-sm font-bold text-purple-900 flex items-center">
                      <IndianRupee size={12} />{(customer.totalSpent || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Joined</p>
                    <p className="text-xs font-medium text-purple-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              onClick={() => fetchCustomers(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-purple-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => fetchCustomers(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;

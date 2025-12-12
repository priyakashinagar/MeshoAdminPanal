import React, { useState, useEffect } from 'react';
import { Headphones, Clock, CheckCircle, AlertCircle, MessageSquare, User, Calendar, Filter, Search, Loader2, RefreshCw } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import adminService from '../services/adminService';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎫 Fetching tickets...');
      const response = await adminService.getTickets();
      console.log('🎫 Tickets Response:', response);
      
      // Handle multiple response structures
      const ticketsData = response.data?.tickets || response.tickets || response.data || response || [];
      
      // Ensure it's an array
      if (Array.isArray(ticketsData)) {
        setTickets(ticketsData);
        console.log('🎫 Total Tickets:', ticketsData.length);
      } else {
        console.warn('⚠️ Tickets data is not an array:', ticketsData);
        setTickets([]);
      }
    } catch (err) {
      console.error('❌ Error fetching tickets:', err);
      setError(err.message || 'Failed to fetch support tickets');
      setTickets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await adminService.updateTicketStatus(ticketId, newStatus);
      fetchTickets(); // Refresh data
    } catch (err) {
      console.error('Error updating ticket status:', err);
    }
  };

  const stats = {
    open: Array.isArray(tickets) ? tickets.filter(t => t.status === 'open').length : 0,
    inProgress: Array.isArray(tickets) ? tickets.filter(t => t.status === 'in-progress' || t.status === 'in_progress').length : 0,
    resolved: Array.isArray(tickets) ? tickets.filter(t => t.status === 'resolved').length : 0,
    total: Array.isArray(tickets) ? tickets.length : 0
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
          <button onClick={fetchTickets} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status) => {
    const config = {
      'open': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'in-progress': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    const { color, icon: Icon } = config[status] || config.open;
    const statusText = status === 'in-progress' ? 'In-progress' : status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        {statusText}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Support Tickets</h1>
          <p className="text-sm text-gray-600 mt-1">Manage customer support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-600 font-medium">Open</p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.open}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">Resolved</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-purple-800 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 w-full overflow-hidden">
        <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[900px] w-full text-left table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <th className="px-2 py-3 text-left font-semibold w-[9%] whitespace-nowrap">Ticket ID</th>
                <th className="px-2 py-3 text-left font-semibold w-[18%] whitespace-nowrap">Title</th>
                <th className="px-2 py-3 text-left font-semibold w-[13%] whitespace-nowrap">Customer</th>
                <th className="px-2 py-3 text-left font-semibold w-[11%] whitespace-nowrap">Category</th>
                <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Priority</th>
                <th className="px-2 py-3 text-left font-semibold w-[11%] whitespace-nowrap">Status</th>
                <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Created</th>
                <th className="px-2 py-3 text-left font-semibold w-[18%] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr><td colSpan="8" className="px-2 py-8 text-center text-gray-500">No tickets found</td></tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-2 py-3 font-medium text-purple-900">{ticket.id}</td>
                    <td className="px-2 py-3 truncate" title={ticket.title}>{ticket.title}</td>
                    <td className="px-2 py-3 truncate" title={ticket.customer}>{ticket.customer}</td>
                    <td className="px-2 py-3 text-sm text-gray-700">{ticket.category}</td>
                    <td className="px-2 py-3">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-2 py-3">{getStatusBadge(ticket.status)}</td>
                    <td className="px-2 py-3 text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2 items-center flex-nowrap whitespace-nowrap">
                        <button className="text-purple-600 font-bold hover:underline text-sm">
                          View
                        </button>
                        <button className="text-blue-600 font-bold hover:underline text-sm">
                          Reply
                        </button>
                        {ticket.status !== 'resolved' && (
                          <button className="text-green-600 font-bold hover:underline text-sm">
                            Resolve
                          </button>
                        )}
                      </div>
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

export default SupportTickets;

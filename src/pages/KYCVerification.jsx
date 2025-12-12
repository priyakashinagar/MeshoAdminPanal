import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Eye, Download, AlertCircle, Filter, Search } from 'lucide-react';
import adminService from '../services/adminService';
import AdminLayout from '../components/layout/AdminLayout';

const KYCVerification = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, submitted: 0, approved: 0, rejected: 0 });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchKYCSubmissions();
  }, [selectedStatus]);

  const fetchKYCSubmissions = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching KYC submissions...');
      
      const params = {};
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response = await adminService.getKYCSubmissions(params);
      console.log('📋 KYC Response:', response);

      let submissionsData = [];
      let statsData = { pending: 0, submitted: 0, approved: 0, rejected: 0 };

      if (response.data?.submissions) {
        submissionsData = response.data.submissions;
        statsData = response.data.stats || statsData;
      } else if (response.submissions) {
        submissionsData = response.submissions;
        statsData = response.stats || statsData;
      } else if (response.data?.data) {
        submissionsData = response.data.data;
        statsData = response.data.stats || statsData;
      } else if (Array.isArray(response.data)) {
        submissionsData = response.data;
      } else if (Array.isArray(response)) {
        submissionsData = response;
      }

      setSubmissions(submissionsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching KYC submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyKYC = async (sellerId, isApproved) => {
    try {
      const data = { 
        isVerified: isApproved,
        kycStatus: isApproved ? 'approved' : 'rejected'
      };
      
      if (!isApproved && rejectionReason) {
        data.rejectionReason = rejectionReason;
      }

      await adminService.verifySeller(sellerId, data);
      
      // Refresh list
      fetchKYCSubmissions();
      setShowModal(false);
      setRejectionReason('');
      setVerificationAction(null);
    } catch (error) {
      console.error('❌ Error verifying KYC:', error);
      alert('Failed to update KYC status');
    }
  };

  const openVerificationModal = (submission, action) => {
    setSelectedSubmission(submission);
    setVerificationAction(action);
    setShowModal(true);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-sm text-gray-600 mt-1">Review and verify seller KYC submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.pending || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Submitted</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{stats.submitted || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-800 mt-1">{stats.approved || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-800 mt-1">{stats.rejected || 0}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* KYC Submissions Table */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[900px] w-full text-left table-fixed">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold w-[12%]">Shop Name</th>
                <th className="px-4 py-4 text-left font-semibold w-[18%]">Seller Info</th>
                <th className="px-4 py-4 text-left font-semibold w-[10%]">Business Type</th>
                <th className="px-4 py-4 text-left font-semibold w-[15%]">GST Number</th>
                <th className="px-4 py-4 text-left font-semibold w-[10%]">Status</th>
                <th className="px-4 py-4 text-left font-semibold w-[12%]">Submitted</th>
                <th className="px-4 py-4 text-left font-semibold w-[13%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                      <p className="mt-3 text-gray-600">Loading KYC submissions...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No KYC submissions found</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-purple-900 truncate" title={submission.shopName}>{submission.shopName || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-purple-900">{submission.user?.name || 'N/A'}</div>
                        <div className="text-gray-600 text-xs truncate" title={submission.user?.email}>{submission.user?.email || 'N/A'}</div>
                        <div className="text-gray-600 text-xs">{submission.user?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                      {submission.businessType || 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-mono text-gray-700">{submission.gstNumber || 'N/A'}</div>
                      <div className="text-xs font-mono text-gray-500">PAN: {submission.panNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(submission.kycStatus)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {submission.createdAt ? new Date(submission.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowModal(true);
                            setVerificationAction('view');
                          }}
                          className="text-purple-600 font-bold hover:underline text-sm"
                          title="View Details"
                        >
                          View
                        </button>
                        
                        {submission.kycStatus === 'submitted' && (
                          <>
                            <button
                              onClick={() => openVerificationModal(submission, 'approve')}
                              className="text-green-600 font-bold hover:underline text-sm"
                              title="Approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openVerificationModal(submission, 'reject')}
                              className="text-red-600 font-bold hover:underline text-sm"
                              title="Reject"
                            >
                              Reject
                            </button>
                          </>
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

      {/* Verification Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">KYC Details - {selectedSubmission.shopName}</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Seller Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSubmission.user?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSubmission.user?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSubmission.user?.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Business Type:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedSubmission.businessType}</span>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Business Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">GST Number:</span>
                    <span className="ml-2 font-mono font-medium text-gray-900">{selectedSubmission.gstNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">PAN Number:</span>
                    <span className="ml-2 font-mono font-medium text-gray-900">{selectedSubmission.panNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedSubmission.kycStatus)}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedSubmission.kycDocuments && selectedSubmission.kycDocuments.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">KYC Documents</h4>
                  <div className="space-y-2">
                    {selectedSubmission.kycDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{doc.type || 'Document'}</span>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason Input */}
              {verificationAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                    setVerificationAction(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Close
                </button>

                {verificationAction === 'approve' && (
                  <button
                    onClick={() => handleVerifyKYC(selectedSubmission._id, true)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve KYC
                  </button>
                )}

                {verificationAction === 'reject' && (
                  <button
                    onClick={() => handleVerifyKYC(selectedSubmission._id, false)}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject KYC
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default KYCVerification;


import React, { useState } from 'react';
import Card from '../components/common/Card';
import { Loader2, CheckCircle, AlertCircle, MessageSquare, Phone, Mail, HelpCircle } from 'lucide-react';
import adminService from '../services/adminService';

const faqs = [
  { q: 'How do I add a new product?', a: 'Go to Add Product page, fill in the product details including name, price, description, and images, then click Submit.' },
  { q: 'How can I check my KYC status?', a: 'Visit the KYC page to see your current verification status. You can also upload documents if needed.' },
  { q: 'How do I contact support?', a: 'Fill the support form below or email support@meesho.com. Our team typically responds within 24 hours.' },
  { q: 'When do I receive my payouts?', a: 'Payouts are processed weekly. You can view your earnings and payout status in the Earnings section.' },
  { q: 'How do I handle returns?', a: 'Return requests appear in the Returns section. You can approve or reject them based on your return policy.' },
  { q: 'How do I update my store profile?', a: 'Go to Profile settings to update your store name, contact details, bank information, and other details.' },
];

export default function Support() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    category: 'general',
    priority: 'medium',
    message: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await adminService.submitSupportTicket(form);
      setSuccess('Your support ticket has been submitted successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', category: 'general', priority: 'medium', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit support ticket. Please try again.');
      console.error('Error submitting ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:p-4">
      <h2 className="text-2xl font-bold mb-2 text-purple-900">Help & Support</h2>
      <p className="text-purple-700 mb-6">Get help with your seller account or contact our support team.</p>
      
      <div className="max-w-4xl w-full mx-auto px-2 sm:px-0">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-purple-100 shadow-lg text-center hover:shadow-xl transition-shadow">
            <Mail className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Email Support</h3>
            <a href="mailto:support@meesho.com" className="text-pink-600 font-medium hover:underline">
              support@meesho.com
            </a>
            <p className="text-sm text-purple-500 mt-2">Response within 24 hours</p>
          </Card>
          
          <Card className="p-6 border border-purple-100 shadow-lg text-center hover:shadow-xl transition-shadow">
            <Phone className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Phone Support</h3>
            <a href="tel:+919876543210" className="text-pink-600 font-medium hover:underline">
              +91 98765 43210
            </a>
            <p className="text-sm text-purple-500 mt-2">Mon-Sat, 9 AM - 6 PM</p>
          </Card>
          
          <Card className="p-6 border border-purple-100 shadow-lg text-center hover:shadow-xl transition-shadow">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Live Chat</h3>
            <span className="text-pink-600 font-medium">Coming Soon</span>
            <p className="text-sm text-purple-500 mt-2">24/7 assistance</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <Card className="p-6 border border-purple-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="text-purple-600" size={24} />
              <h3 className="text-xl font-semibold text-purple-700">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-purple-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium text-purple-700">{faq.q}</span>
                    <span className="text-purple-500 text-xl">
                      {expandedFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-4 py-3 bg-white text-purple-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Support Form */}
          <Card className="p-6 border border-purple-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="text-purple-600" size={24} />
              <h3 className="text-xl font-semibold text-purple-700">Submit a Ticket</h3>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-purple-600 font-medium mb-1">Subject *</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  placeholder="Brief subject of your issue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="orders">Orders</option>
                    <option value="payments">Payments/Payouts</option>
                    <option value="products">Products</option>
                    <option value="returns">Returns</option>
                    <option value="kyc">KYC/Verification</option>
                    <option value="technical">Technical Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-600 font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-600 font-medium mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={18} />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={18} />
                  <span className="font-medium">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow font-semibold mt-2 flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

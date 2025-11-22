
import React, { useState } from 'react';
import Card from '../components/common/Card';

const faqs = [
  { q: 'How do I add a new product?', a: 'Go to Add Product page and fill the form.' },
  { q: 'How can I check my KYC status?', a: 'Visit the KYC page to see your current status.' },
  { q: 'How do I contact support?', a: 'Fill the support form below or email support@mesho.com.' },
];

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill all fields.');
      return;
    }
    setSuccess('Your message has been sent!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className=" md:p-4">
      <h2 className="text-2xl font-bold mb-2">Support</h2>
      <p className="text-purple-700 mb-6">Contact support or find answers to common questions.</p>
      <div className="max-w-xl w-full mx-auto px-2 sm:px-0 flex flex-col gap-8">
        <Card className="p-6 border border-purple-100 shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Contact Information</h3>
          <div className="mb-2 text-purple-900">Email: <span className="font-medium">support@mesho.com</span></div>
          <div className="mb-2 text-purple-900">Phone: <span className="font-medium">+91 98765 43210</span></div>
        </Card>
        <Card className="p-6 border border-purple-100 shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Frequently Asked Questions</h3>
          <ul className="list-disc pl-5">
            {faqs.map((faq, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold text-purple-600">{faq.q}</span>
                <div className="text-purple-900 ml-2">{faq.a}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 border border-purple-100 shadow-lg">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Support Form</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-purple-600 font-medium mb-1">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your name"
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
                className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-purple-600 font-medium mb-1">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400"
                placeholder="Type your message"
                rows={3}
                required
              />
            </div>
            {error && <div className="text-red-600 font-semibold">{error}</div>}
            {success && <div className="text-green-600 font-semibold">{success}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl shadow font-semibold mt-2"
            >
              Send Message
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
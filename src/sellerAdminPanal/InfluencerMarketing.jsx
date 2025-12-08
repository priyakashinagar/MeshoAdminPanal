import React from 'react';
import { Users, TrendingUp, Target, Award } from 'lucide-react';

export default function InfluencerMarketing() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Influencer Marketing</h2>
      <p className="text-gray-600 mb-6">Collaborate with influencers to boost your product sales.</p>

      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-2">Grow Your Sales with Influencers</h3>
        <p className="mb-4">Connect with top influencers and reach millions of potential customers</p>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
          Get Started
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Users className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Active Campaigns</h3>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <TrendingUp className="text-green-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Total Reach</h3>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Award className="text-purple-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Sales Generated</h3>
          <div className="text-3xl font-bold text-gray-900">₹0</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
            <h4 className="font-semibold text-gray-900 mb-2">Choose Influencers</h4>
            <p className="text-sm text-gray-600">Select from our network of verified influencers</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
            <h4 className="font-semibold text-gray-900 mb-2">Launch Campaign</h4>
            <p className="text-sm text-gray-600">Set your budget and campaign duration</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
            <h4 className="font-semibold text-gray-900 mb-2">Track Results</h4>
            <p className="text-sm text-gray-600">Monitor sales and engagement in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

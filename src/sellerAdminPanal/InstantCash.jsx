import React from 'react';
import { Zap, IndianRupee, Clock, CheckCircle } from 'lucide-react';

export default function InstantCash() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Instant Cash</h2>
      <p className="text-gray-600 mb-6">Get instant payment advances on your pending orders.</p>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Zap size={48} />
          <div>
            <h3 className="text-2xl font-bold mb-1">Get Cash Instantly</h3>
            <p className="text-green-100">Advance payment on your pending settlements</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">₹0</div>
            <div className="text-sm">Available for Advance</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">0%</div>
            <div className="text-sm">Low Interest Rate</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">24h</div>
            <div className="text-sm">Instant Disbursal</div>
          </div>
        </div>
        <button className="mt-6 bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Apply for Instant Cash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <IndianRupee className="text-green-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Total Borrowed</h3>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Clock className="text-orange-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Pending Repayment</h3>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <CheckCircle className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Repaid</h3>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How Instant Cash Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-green-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Check Eligibility</h4>
              <p className="text-sm text-gray-600">Based on your pending orders and sales history</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-green-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Apply for Advance</h4>
              <p className="text-sm text-gray-600">Choose the amount you need instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-green-600">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Get Money in 24 Hours</h4>
              <p className="text-sm text-gray-600">Money transferred directly to your bank account</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-green-600">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Auto Repayment</h4>
              <p className="text-sm text-gray-600">Automatically deducted from your settlements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

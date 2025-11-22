
import React from 'react';
import Card from '../components/common/Card';
// Dummy sellers with KYC status
const sellers = [
  { id: 1, name: 'Amit Sharma', store: 'Amit Fashion Hub', kyc: 'Pending' },
  { id: 2, name: 'Priya Singh', store: 'Priya Boutique', kyc: 'Completed' },
  { id: 3, name: 'Rahul Jain', store: 'Rahul Trends', kyc: 'Pending' },
  { id: 4, name: 'Neha Verma', store: 'Neha Styles', kyc: 'Rejected' },
];

export default function KYC() {
  const incomplete = sellers.filter(s => s.kyc !== 'Completed');
  return (
    <div className="overflow-x-hidden w-full min-h-screen p-3 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 max-w-full" style={{width: '100vw', maxWidth: '100vw'}}>
      <h2 className="text-3xl font-bold mb-4 text-purple-700 text-center">KYC Status - Sellers</h2>
      <p className="text-purple-500 mb-8 text-lg text-center">Sellers with incomplete or pending KYC. Only admin can view and manage these.</p>
      <div className="w-full">
        <Card className="p-4 md:p-8 border border-purple-100 shadow-2xl rounded-2xl bg-white">
          <div className="overflow-x-auto max-h-[400px] scrollbar-hide w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] w-full text-left max-w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Seller Name</th>
                  <th className="px-4 py-3 text-left">Store</th>
                  <th className="px-4 py-3 text-left">KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {incomplete.map(seller => (
                  <tr key={seller.id} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-purple-900">{seller.name}</td>
                    <td className="px-4 py-3">{seller.store}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-normal ${seller.kyc === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{seller.kyc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import AdminLayout from '../components/layout/AdminLayout';

const dummyReports = [
  { id: 1, month: "January", totalSales: 12000, orders: 150 },
  { id: 2, month: "February", totalSales: 9500, orders: 120 },
  { id: 3, month: "March", totalSales: 14300, orders: 180 },
];

const SalesReports = () => {
  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-purple-900 mb-6">Sales Reports</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold not-italic" style={{fontStyle:'normal'}}>ID</th>
                <th className="px-6 py-4 text-left font-bold not-italic" style={{fontStyle:'normal'}}>Month</th>
                <th className="px-6 py-4 text-left font-bold not-italic" style={{fontStyle:'normal', fontFamily:'sans-serif', fontWeight:'bold'}}>Total Sales</th>
                <th className="px-6 py-4 text-left font-bold not-italic" style={{fontStyle:'normal'}}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {dummyReports.map((report) => (
                <tr key={report.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-normal not-italic text-purple-900" style={{fontStyle:'normal'}}>{report.id}</td>
                  <td className="px-6 py-4 font-normal not-italic" style={{fontStyle:'normal'}}>{report.month}</td>
                  <td className="px-6 py-4 font-normal not-italic" style={{fontStyle:'normal', fontFamily:'sans-serif', fontWeight:'normal'}}>${report.totalSales}</td>
                  <td className="px-6 py-4 font-normal not-italic" style={{fontStyle:'normal'}}>{report.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReports;

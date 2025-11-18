import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const lineData = [
  { name: 'Mon', Sales: 400 },
  { name: 'Tue', Sales: 700 },
  { name: 'Wed', Sales: 200 },
  { name: 'Thu', Sales: 900 },
  { name: 'Fri', Sales: 500 },
  { name: 'Sat', Sales: 800 },
  { name: 'Sun', Sales: 650 },
];

const pieData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Books', value: 200 },
  { name: 'Home & Garden', value: 100 },
];

const COLORS = ['#A259FF', '#E639AC', '#FFB6F9', '#59168B'];

const DashboardCharts = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-purple-700 mb-4">Sales Trend (Line Chart)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip wrapperClassName="!bg-white !border !border-purple-200 !rounded-lg !shadow" />
          <Line type="monotone" dataKey="Sales" stroke="#A259FF" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-purple-700 mb-4">Category Distribution (Circle Chart)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#A259FF"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip wrapperClassName="!bg-white !border !border-purple-200 !rounded-lg !shadow" />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardCharts;

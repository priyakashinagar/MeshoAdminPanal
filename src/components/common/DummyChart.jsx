import React from 'react';

const DummyChart = ({ title }) => (
  <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center min-h-[220px]">
    <h3 className="text-lg font-bold text-purple-700 mb-4">{title}</h3>
    {/* Simple dummy bar chart */}
    <div className="w-full flex items-end gap-2 h-32">
      {[60, 90, 40, 80, 30, 100, 70].map((val, i) => (
        <div key={i} className="flex flex-col items-center justify-end h-full">
          <div
            className="w-6 rounded-t-lg bg-gradient-to-t from-pink-400 to-purple-400"
            style={{ height: `${val}%` }}
          ></div>
          <span className="text-xs text-purple-400 mt-1">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
        </div>
      ))}
    </div>
  </div>
);

export default DummyChart;

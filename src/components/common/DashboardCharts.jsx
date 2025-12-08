import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import adminService from '../../services/adminService';
import { Loader2 } from 'lucide-react';

const COLORS = ['#A259FF', '#E639AC', '#FFB6F9', '#59168B', '#8B5CF6', '#EC4899'];

const DashboardCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // Get last 7 days analytics
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await adminService.getAnalytics({ startDate, endDate });
      const data = response.data || response;
      
      // Format sales data for line chart
      if (data.salesData && data.salesData.length > 0) {
        const formattedSales = data.salesData.map(item => ({
          name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
          Sales: item.totalSales || 0,
          Orders: item.orderCount || 0
        }));
        setSalesData(formattedSales);
      } else {
        // Generate last 7 days with zero values if no data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        const defaultData = [];
        for (let i = 6; i >= 0; i--) {
          const dayIndex = (today - i + 7) % 7;
          defaultData.push({ name: days[dayIndex], Sales: 0, Orders: 0 });
        }
        setSalesData(defaultData);
      }
      
      // Format category data for pie chart
      if (data.categoryStats && data.categoryStats.length > 0) {
        const formattedCategory = data.categoryStats.slice(0, 6).map(item => ({
          name: item._id?.name || item.categoryName || 'Other',
          value: item.totalSales || 0
        }));
        setCategoryData(formattedCategory);
      } else {
        // Fetch from products if no order data
        try {
          const productsRes = await adminService.getAllProducts({ limit: 100 });
          const products = productsRes.data?.products || productsRes.products || [];
          
          // Group by category
          const categoryMap = {};
          products.forEach(p => {
            const catName = p.category?.name || 'Other';
            if (!categoryMap[catName]) {
              categoryMap[catName] = 0;
            }
            categoryMap[catName] += p.soldCount || 1;
          });
          
          const catData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
          setCategoryData(catData.length > 0 ? catData.slice(0, 6) : [
            { name: 'No Data', value: 1 }
          ]);
        } catch {
          setCategoryData([{ name: 'No Data', value: 1 }]);
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Set default empty data
      setSalesData([
        { name: 'Mon', Sales: 0, Orders: 0 },
        { name: 'Tue', Sales: 0, Orders: 0 },
        { name: 'Wed', Sales: 0, Orders: 0 },
        { name: 'Thu', Sales: 0, Orders: 0 },
        { name: 'Fri', Sales: 0, Orders: 0 },
        { name: 'Sat', Sales: 0, Orders: 0 },
        { name: 'Sun', Sales: 0, Orders: 0 },
      ]);
      setCategoryData([{ name: 'No Data', value: 1 }]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6 flex items-center justify-center h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
        <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6 flex items-center justify-center h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-purple-700 mb-4">Sales Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
              wrapperClassName="!bg-white !border !border-purple-200 !rounded-lg !shadow" 
            />
            <Line type="monotone" dataKey="Sales" stroke="#A259FF" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white border border-purple-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-purple-700 mb-4">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#A259FF"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
              wrapperClassName="!bg-white !border !border-purple-200 !rounded-lg !shadow" 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;

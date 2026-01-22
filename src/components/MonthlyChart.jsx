import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyChart = ({ data }) => {
  const chartData = Object.entries(data)
    .sort(([,a], [,b]) => b.totalTime - a.totalTime)
    .slice(0, 10)
    .map(([name, stats]) => ({
      name: name.length > 6 ? name.substring(0, 6) + '...' : name,
      fullName: name,
      hours: Math.round(stats.totalTime / 60 * 100) / 100,
      minutes: stats.totalTime,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">工时分布图</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'hours' ? `${value} 小时` : `${value} 分钟`,
                name === 'hours' ? '工时' : '分钟'
              ]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item ? item.fullName : label;
              }}
            />
            <Bar dataKey="hours" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;

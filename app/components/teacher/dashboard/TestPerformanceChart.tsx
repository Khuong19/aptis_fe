'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartData {
  month: string;
  averageScore: number;
  completionRate: number;
  totalTests: number;
}

interface TestTypeData {
  type: string;
  count: number;
  color: string;
}

interface TestPerformanceChartProps {
  data?: ChartData[];
  testTypeData?: TestTypeData[];
  loading?: boolean;
}

const COLORS = ['#152C61', '#AC292D', '#4F46E5', '#059669', '#DC2626'];

const TestPerformanceChart: React.FC<TestPerformanceChartProps> = ({ 
  data = [], 
  testTypeData = [],
  loading = false 
}) => {
  // Default mock data if no data provided
  const defaultData: ChartData[] = [
    { month: 'Jan', averageScore: 78, completionRate: 85, totalTests: 12 },
    { month: 'Feb', averageScore: 82, completionRate: 88, totalTests: 15 },
    { month: 'Mar', averageScore: 75, completionRate: 82, totalTests: 18 },
    { month: 'Apr', averageScore: 88, completionRate: 91, totalTests: 22 },
    { month: 'May', averageScore: 85, completionRate: 89, totalTests: 25 },
    { month: 'Jun', averageScore: 90, completionRate: 94, totalTests: 28 }
  ];

  const defaultTestTypeData: TestTypeData[] = [
    { type: 'Reading', count: 45, color: '#152C61' },
    { type: 'Listening', count: 32, color: '#AC292D' },
    { type: 'Speaking', count: 28, color: '#4F46E5' },
    { type: 'Writing', count: 21, color: '#059669' }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const pieData = testTypeData.length > 0 ? testTypeData : defaultTestTypeData;

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Trends */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="averageScore" 
              stroke="#152C61" 
              strokeWidth={3}
              name="Average Score (%)"
              dot={{ fill: '#152C61', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="completionRate" 
              stroke="#AC292D" 
              strokeWidth={3}
              name="Completion Rate (%)"
              dot={{ fill: '#AC292D', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Test Volume */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Test Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="totalTests" 
                fill="#152C61" 
                name="Total Tests"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Test Type Distribution */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ type, count, percent }) => 
                  `${type}: ${count} (${((percent || 0) * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TestPerformanceChart;
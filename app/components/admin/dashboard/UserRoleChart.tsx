'use client';

import React from 'react';
import { ChartData } from '../../../types';

interface UserRoleChartProps {
  chartData: ChartData;
}

const UserRoleChart: React.FC<UserRoleChartProps> = ({ chartData }) => {
  // Simple chart visualization without using a chart library
  const total = chartData.datasets[0].data.reduce((sum, curr) => sum + curr, 0);
  
  const percentages = chartData.datasets[0].data.map(value => 
    Math.round((value / total) * 100)
  );

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Phân bố người dùng</h3>
        <p className="text-sm text-gray-500">Phân bố người dùng theo vai trò</p>
      </div>
      
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          {/* Simplified pie chart representation */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Student slice */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke="#152C61"
              strokeWidth="45" 
              strokeDasharray={`${percentages[0] * 2.83} ${(100 - percentages[0]) * 2.83}`}
              strokeDashoffset="0"
              className="origin-center -rotate-90"
            ></circle>
            
            {/* Teacher slice */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke="#AC292D"
              strokeWidth="45" 
              strokeDasharray={`${percentages[1] * 2.83} ${(100 - percentages[1]) * 2.83}`}
              strokeDashoffset={`${(100 - percentages[0]) * 2.83}`}
              className="origin-center -rotate-90"
            ></circle>
            
            {/* Inner white circle to create donut effect */}
            <circle 
              cx="50" 
              cy="50" 
              r="25" 
              fill="white"
            ></circle>
          </svg>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {chartData.labels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded mr-2" 
              style={{ backgroundColor: chartData.datasets[0].backgroundColor?.[index] }}
            ></div>
            <span className="text-sm text-gray-700">{label} ({chartData.datasets[0].data[index]})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRoleChart; 
import { StatsCard, ChartData } from '../../types';
import { getUserStats } from './users';
import { getTestStats } from './tests';

export const getStatsCards = (): StatsCard[] => {
  const userStats = getUserStats();
  const testStats = getTestStats();

  return [
    {
      title: 'Total Users',
      value: userStats.total,
      change: 12,
      icon: 'users'
    },
    {
      title: 'Active Users',
      value: userStats.active,
      change: 8,
      icon: 'user-circle'
    },
    {
      title: 'Tests',
      value: testStats.total,
      change: 5,
      icon: 'clipboard'
    },
    {
      title: 'Recent Logins',
      value: userStats.recentLogins,
      change: -3,
      icon: 'login'
    }
  ];
};

export const getUserRoleChartData = (): ChartData => {
  const userStats = getUserStats();
  
  return {
    labels: ['Students', 'Teachers'],
    datasets: [
      {
        label: 'User Distribution by Role',
        data: [userStats.students, userStats.teachers],
        backgroundColor: ['#152C61', '#AC292D'],
        borderWidth: 0,
      },
    ],
  };
};

export const getTestStatusChartData = (): ChartData => {
  const testStats = getTestStats();
  
  return {
    labels: ['Published', 'Draft'],
    datasets: [
      {
        label: 'Test Status',
        data: [testStats.published, testStats.draft],
        backgroundColor: ['#4CAF50', '#FFA000'],
        borderWidth: 0,
      },
    ],
  };
}; 
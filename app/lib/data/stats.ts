import { StatsCard, ChartData } from '../../types';
import { getUserStats } from './users';
import { getTestStats } from './tests';

export const getStatsCards = (): StatsCard[] => {
  const userStats = getUserStats();
  const testStats = getTestStats();

  return [
    {
      title: 'Tổng số người dùng',
      value: userStats.total,
      change: 12,
      icon: 'users'
    },
    {
      title: 'Người dùng hoạt động',
      value: userStats.active,
      change: 8,
      icon: 'user-circle'
    },
    {
      title: 'Bài kiểm tra',
      value: testStats.total,
      change: 5,
      icon: 'clipboard'
    },
    {
      title: 'Đăng nhập gần đây',
      value: userStats.recentLogins,
      change: -3,
      icon: 'login'
    }
  ];
};

export const getUserRoleChartData = (): ChartData => {
  const userStats = getUserStats();
  
  return {
    labels: ['Học viên', 'Giáo viên'],
    datasets: [
      {
        label: 'Phân bố người dùng theo vai trò',
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
    labels: ['Đã xuất bản', 'Đang soạn thảo'],
    datasets: [
      {
        label: 'Trạng thái bài kiểm tra',
        data: [testStats.published, testStats.draft],
        backgroundColor: ['#4CAF50', '#FFA000'],
        borderWidth: 0,
      },
    ],
  };
}; 
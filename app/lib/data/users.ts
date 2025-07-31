import { User } from '../../types';

export const dummyUsers: User[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    lastLogin: '2025-06-15T08:30:00Z',
    createdAt: '2025-01-10T12:00:00Z',
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    lastLogin: '2025-06-16T10:45:00Z',
    createdAt: '2024-11-20T15:30:00Z',
  },
  {
    id: '3',
    fullName: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'inactive',
    lastLogin: '2025-05-30T14:20:00Z',
    createdAt: '2025-02-05T09:15:00Z',
  },
  {
    id: '4',
    fullName: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?img=10',
    status: 'active',
    lastLogin: '2025-06-14T16:10:00Z',
    createdAt: '2024-09-18T11:45:00Z',
  },
  {
    id: '5',
    fullName: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'student',
    status: 'active',
    lastLogin: '2025-06-16T09:05:00Z',
    createdAt: '2025-03-22T13:30:00Z',
  },
  {
    id: '6',
    fullName: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'active',
    lastLogin: '2025-06-15T11:25:00Z',
    createdAt: '2025-01-30T10:20:00Z',
  },
  {
    id: '7',
    fullName: 'Robert Anderson',
    email: 'robert.anderson@example.com',
    role: 'teacher',
    status: 'inactive',
    createdAt: '2025-04-12T08:40:00Z',
  },
  {
    id: '8',
    fullName: 'Jennifer Martin',
    email: 'jennifer.martin@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'active',
    lastLogin: '2025-06-10T13:15:00Z',
    createdAt: '2025-02-28T16:50:00Z',
  },
  {
    id: '9',
    fullName: 'Thomas White',
    email: 'thomas.white@example.com',
    role: 'teacher',
    status: 'active',
    lastLogin: '2025-06-16T08:00:00Z',
    createdAt: '2024-10-05T14:30:00Z',
  },
  {
    id: '10',
    fullName: 'Lisa Clark',
    email: 'lisa.clark@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'active',
    lastLogin: '2025-06-15T15:40:00Z',
    createdAt: '2025-03-15T09:10:00Z',
  },
];

// Helper functions
export function getUsersByRole(role: 'student' | 'teacher' | 'all') {
  if (role === 'all') return dummyUsers;
  return dummyUsers.filter(user => user.role === role);
}

export function getUserStats() {
  const total = dummyUsers.length;
  const active = dummyUsers.filter(user => user.status === 'active').length;
  const students = dummyUsers.filter(user => user.role === 'student').length;
  const teachers = dummyUsers.filter(user => user.role === 'teacher').length;
  
  return {
    total,
    active,
    students,
    teachers,
    recentLogins: dummyUsers.filter(user => user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
  };
} 
// Shared teacher navigation configuration
import { 
  Home, 
  BookOpen, 
  BookImage,
  FilePlus, 
  Headphones, 
  User
} from 'lucide-react';

// Navigation configuration shared between sidebar and layout
export const teacherNavItems = [
  {
    label: 'Dashboard',
    name: 'Dashboard',
    href: '/teacher/dashboard',
    icon: Home,
  },
  {
    label: 'Reading Question Bank',
    name: 'Reading Question Bank',
    href: '/teacher/reading-question-bank',
    icon: BookOpen,
  },
  {
    label: 'Listening Question Bank',
    name: 'Listening Question Bank',
    href: '/teacher/listening-question-bank',
    icon: Headphones,
  },
  {
    label: 'My Tests',
    name: 'Tests',
    href: '/teacher/tests',
    icon: BookImage,
  },
  {
    label: 'Profile',
    name: 'Profile',
    href: '/teacher/profile',
    icon: User,
  },
];

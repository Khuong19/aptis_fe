import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { teacherNavItems } from './teacherNavConfig';

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-0 shadow-sm z-50">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-navy-600">
          <span className="text-[#152C61]">Teacher</span> Dashboard
        </h1>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {teacherNavItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#152C61] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-8 w-full px-4">
        <Link
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
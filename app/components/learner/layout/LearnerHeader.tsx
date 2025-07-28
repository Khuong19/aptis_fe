import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import { learnerProfile } from '@/app/lib/data/learner/profile';

interface LearnerHeaderProps {
  onToggleSidebar: () => void;
}

export default function LearnerHeader({ onToggleSidebar }: LearnerHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className="mr-4 md:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-[#152C61]">Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-600 hover:text-gray-900 relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-[#AC292D] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm">New test has been added</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm">You have an unfinished test</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {learnerProfile.avatar ? (
              <img 
                src={learnerProfile.avatar} 
                alt={learnerProfile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {learnerProfile.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-sm font-medium hidden md:block">
            {learnerProfile.name}
          </span>
        </div>
      </div>
    </header>
  );
} 
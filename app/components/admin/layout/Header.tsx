import { UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useUser } from '@/app/hooks/useUser';

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { user, loading } = useUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-500 hover:text-gray-700"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <span className="ml-2 text-gray-700 font-medium">
            {loading ? 'Loading...' : user?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import { TeacherProfile } from '@/app/types';
import { Mail, BookOpen } from 'lucide-react';

interface ProfileCardProps {
  profile: TeacherProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-[#152C61] h-32"></div>
      
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-medium text-gray-600">
                {profile.name.charAt(0)}
              </span>
            )}
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{profile.name}</h2>
          
          <div className="mt-2 flex items-center text-gray-600">
            <Mail size={16} className="mr-1" />
            <span>{profile.email}</span>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
              <BookOpen size={20} className="text-[#152C61] mr-2" />
              <div>
                <p className="text-xs text-gray-500">Tổng số bài kiểm tra</p>
                <p className="text-lg font-semibold text-gray-900">{profile.totalTests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
            <input
              type="text"
              value={profile.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <input
              type="email"
              value={profile.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm"
              readOnly
            />
          </div>
          
          <div className="pt-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#152C61] hover:bg-[#0f1f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
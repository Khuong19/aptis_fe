import { UserProfile } from '@/app/lib/api/profileService';
import { User, Calendar, Award } from 'lucide-react';

interface ProfileStatsProps {
  profile: UserProfile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{profile.role}</h3>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </h3>
            </div>
          </div>
        </div>
        
        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">About</h3>
            <p className="text-sm text-gray-600">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
} 
import { LearnerProfile } from '@/app/types';
import { CheckCircle, Clock } from 'lucide-react';

interface ProfileStatsProps {
  profile: LearnerProfile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Tests</p>
              <h3 className="text-2xl font-semibold text-gray-900">{profile.completedTests}</h3>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-semibold text-gray-900">{profile.inProgressTests}</h3>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-4">Overall Progress</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Completion Rate</span>
              <span className="font-medium">
                {profile.completedTests > 0 
                  ? Math.round((profile.completedTests / (profile.completedTests + profile.inProgressTests)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#152C61] h-2.5 rounded-full" 
                style={{ 
                  width: profile.completedTests > 0 
                    ? `${Math.round((profile.completedTests / (profile.completedTests + profile.inProgressTests)) * 100)}%`
                    : '0%'
                }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Keep up the good work! Complete your in-progress tests to improve your skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
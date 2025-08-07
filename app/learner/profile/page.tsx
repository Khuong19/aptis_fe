'use client';

import { useState, useEffect } from 'react';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import ProfileForm from '@/app/components/learner/profile/ProfileForm';
import ProfileStats from '@/app/components/learner/profile/ProfileStats';
import { ProfileService, UserProfile } from '@/app/lib/api/profileService';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ProfileService.getProfile();
      setProfile(response.user);

    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const response = await ProfileService.updateProfile({
        fullName: updatedProfile.fullName,
        bio: updatedProfile.bio,
      });
      
      setProfile(response.user);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#152C61]"></div>
        </div>
      </LearnerLayout>
    );
  }

  if (error || !profile) {
    return (
      <LearnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error || 'Failed to load profile'}</p>
            <button
              onClick={fetchUserProfile}
              className="px-4 py-2 bg-[#152C61] text-white rounded-md hover:bg-[#0f1f45]"
            >
              Try Again
            </button>
          </div>
        </div>
      </LearnerLayout>
    );
  }
  
  return (
    <LearnerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and view your progress
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm profile={profile} onSave={handleProfileUpdate} />
        </div>
        
        <div className="lg:col-span-1">
          <ProfileStats profile={profile} />
        </div>
      </div>
    </LearnerLayout>
  );
} 
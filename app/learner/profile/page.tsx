'use client';

import { useState } from 'react';
import LearnerLayout from '@/app/components/learner/layout/LearnerLayout';
import ProfileForm from '@/app/components/learner/profile/ProfileForm';
import ProfileStats from '@/app/components/learner/profile/ProfileStats';
import { learnerProfile } from '@/app/lib/data/learner/profile';
import { LearnerProfile } from '@/app/types';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState<LearnerProfile>(learnerProfile);
  
  const handleProfileUpdate = (updatedProfile: Partial<LearnerProfile>) => {
    // In a real application, this would be an API call
    setProfile({ ...profile, ...updatedProfile });
    
    // Show a success message
    toast.success('Profile updated successfully');
  };
  
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
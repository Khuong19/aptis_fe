'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/admin/layout/AdminLayout';
import { UserIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { ProfileService, UserProfile } from '@/app/lib/api/profileService';

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ProfileService.getProfile();
      const userProfile: UserProfile = {
        id: response.user.id,
        fullName: response.user.fullName,
        email: response.user.email,
        bio: response.user.bio || 'No bio available',
        avatar: response.user.avatar,
        createdAt: response.user.createdAt,
        role: response.user.role,
        updatedAt: response.user.updatedAt,
      };

      setProfile(userProfile);
      setFormData({
        fullName: userProfile.fullName,
        bio: userProfile.bio,
      });

    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);

      const response = await ProfileService.updateProfile({
        fullName: formData.fullName,
        bio: formData.bio,
      });
      
      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        fullName: response.user.fullName,
        bio: response.user.bio,
      } : null);

      setIsEditing(false);
      toast.success('Profile updated successfully!');

    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        bio: profile.bio,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#152C61]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !profile) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Profile</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-[#152C61] px-6 py-16 relative">
          <div className="absolute bottom-0 translate-y-1/2 left-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
              {profile.avatar ? (
                <img 
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pt-20 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-400 capitalize">{profile.role}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61] disabled:opacity-50 ${
                isEditing 
                  ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  : 'border-[#152C61] bg-[#152C61] text-white hover:bg-[#0f1f45]'
              }`}
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            // Edit Form
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={4}
                    value={formData.bio || ''}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61]"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#152C61] hover:bg-[#0f1f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Profile Display
            <>
              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="text-gray-600">{profile.bio || 'No bio available'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 
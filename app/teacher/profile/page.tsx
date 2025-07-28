'use client';

import React, { useState, useEffect } from 'react';
import TeacherLayout from '@/app/components/teacher/layout/TeacherLayout';
import { UserIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  role: string;
  totalTests?: number;
  totalQuestions?: number;
}

export default function ProfilePage() {
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

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) {
        throw new Error('No authentication token found');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      const userProfile: UserProfile = {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        bio: data.user.bio || 'No bio available',
        avatar: data.user.avatar,
        createdAt: data.user.createdAt,
        role: data.user.role,
        totalTests: data.user.totalTests || 0,
        totalQuestions: data.user.totalQuestions || 0,
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

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) {
        throw new Error('No authentication token found');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          bio: formData.bio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      
      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        fullName: updatedData.user.fullName,
        bio: updatedData.user.bio,
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
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#152C61]"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (error || !profile) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={fetchUserProfile}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#152C61] hover:bg-[#0f1f45]"
            >
              Try Again
            </button>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher Profile</h1>

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
        <div className="px-6 pt-16 pb-6">
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
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61] disabled:opacity-50"
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

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stats</h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Tests Created</dt>
                    <dd className="mt-1 text-3xl font-semibold text-[#152C61]">{profile.totalTests || 0}</dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Questions Created</dt>
                    <dd className="mt-1 text-3xl font-semibold text-[#152C61]">{profile.totalQuestions || 0}</dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
} 
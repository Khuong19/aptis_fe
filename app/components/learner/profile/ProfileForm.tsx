import { LearnerProfile } from '@/app/types';
import { useState } from 'react';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  profile: LearnerProfile;
  onSave: (updatedProfile: Partial<LearnerProfile>) => void;
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedProfile = {
        name: formData.name,
        email: formData.email,
      };
      
      onSave(updatedProfile);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-[#152C61] hover:text-[#0f1f45]"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                } shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md ${
                  isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                } shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            {isEditing && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm"
                      />
                      {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm"
                      />
                      {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#152C61] focus:ring-[#152C61] sm:text-sm"
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#152C61] hover:bg-[#0f1f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61]"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 
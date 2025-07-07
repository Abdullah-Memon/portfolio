'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProfileEditor from '@/components/admin/ProfileEditor';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (profileData) => {
    const loadingToast = toast.loading('Saving profile...');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        
        // Revalidate multiple pages that might show profile data
        const pagesToRevalidate = ['/about', '/', '/posts'];
        
        for (const page of pagesToRevalidate) {
          try {
            await fetch(`/api/revalidate?path=${page}`, {
              method: 'POST',
            });
          } catch (revalidationError) {
            console.warn(`Failed to revalidate ${page}:`, revalidationError);
          }
        }
        
        toast.success('Profile updated successfully! Changes will be visible on the public site.', { id: loadingToast });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save profile', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Manage Profile
          </Typography>
          <Typography color="gray">
            Update your profile information, experience, and skills
          </Typography>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          profile && (
            <ProfileEditor
              profile={profile}
              onSave={handleSaveProfile}
            />
          )
        )}
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardBody, Typography, Input, Textarea, Button } from '@material-tailwind/react';

export default function ProfileEditor({ profile, onSave }) {
  const [formData, setFormData] = useState({
    // Basic Info
    name: profile.name || '',
    title: profile.title || '',
    bio: profile.bio || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    website: profile.website || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    twitter: profile.twitter || '',
    instagram: profile.instagram || '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up the data before sending
      const profileData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        bio: formData.bio.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
        twitter: formData.twitter.trim(),
        instagram: formData.instagram.trim(),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      };

      console.log('Saving profile data:', profileData);
      await onSave(profileData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Card>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-6">
          Edit Profile Information
        </Typography>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
            />
            <Input
              label="GitHub"
              name="github"
              type="url"
              value={formData.github}
              onChange={handleChange}
            />
            <Input
              label="Twitter"
              name="twitter"
              type="url"
              value={formData.twitter}
              onChange={handleChange}
            />
            <Input
              label="Instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <Textarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              color="teal"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



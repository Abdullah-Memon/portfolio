'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Switch,
  Select,
  Option,
  IconButton,
} from '@material-tailwind/react';
import {
  ArrowLeftIcon,
  PhotoIcon,
  UserIcon,
  StarIcon as StarOutlineIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-hot-toast';

export default function TestimonialEditor({ testimonial, onClose }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientTitle: '',
    company: '',
    feedback: '',
    avatarUrl: '',
    rating: 5,
    featured: false,
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (testimonial) {
      setFormData({
        clientName: testimonial.clientName || '',
        clientTitle: testimonial.clientTitle || '',
        company: testimonial.company || '',
        feedback: testimonial.feedback || '',
        avatarUrl: testimonial.avatarUrl || '',
        rating: testimonial.rating || 5,
        featured: testimonial.featured || false,
        published: testimonial.published !== false,
      });
      setPreviewImage(testimonial.avatarUrl || '');
    }
  }, [testimonial]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'avatarUrl') {
      setPreviewImage(value);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientName.trim() || !formData.clientTitle.trim() || !formData.feedback.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const url = testimonial 
        ? `/api/testimonials/${testimonial.id}`
        : '/api/testimonials';
      
      const method = testimonial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedTestimonial = await response.json();
        toast.success(`Testimonial ${testimonial ? 'updated' : 'created'} successfully`);
        onClose(savedTestimonial);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleRatingChange(index + 1)}
            className="focus:outline-none"
          >
            {index < formData.rating ? (
              <StarSolidIcon className="h-6 w-6 text-yellow-400 hover:text-yellow-500 transition-colors" />
            ) : (
              <StarOutlineIcon className="h-6 w-6 text-gray-300 hover:text-yellow-300 transition-colors" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating} star{formData.rating !== 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <IconButton
            variant="outlined"
            color="gray"
            onClick={() => onClose()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </IconButton>
          <div>
            <Typography variant="h2" color="blue-gray">
              {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </Typography>
            <Typography color="gray">
              {testimonial ? 'Update testimonial details' : 'Create a new client testimonial'}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Client Information */}
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Client Information
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Client Name *"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        required
                      />
                      <Input
                        label="Client Title *"
                        value={formData.clientTitle}
                        onChange={(e) => handleInputChange('clientTitle', e.target.value)}
                        placeholder="e.g., CEO, CTO, Manager"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Input
                        label="Company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="e.g., Tech Innovations Inc."
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Input
                        label="Avatar URL"
                        value={formData.avatarUrl}
                        onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        icon={<PhotoIcon />}
                      />
                      <Typography variant="small" color="gray" className="mt-1">
                        Optional: URL to client&apos;s profile picture
                      </Typography>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Testimonial Content
                    </Typography>
                    
                    <div className="mb-4">
                      <Textarea
                        label="Feedback *"
                        value={formData.feedback}
                        onChange={(e) => handleInputChange('feedback', e.target.value)}
                        placeholder="Share the client's feedback about your work..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Rating *
                      </Typography>
                      {renderStarRating()}
                    </div>
                  </div>

                  {/* Settings */}
                  <div>
                    <Typography variant="h6" color="blue-gray" className="mb-4">
                      Settings
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography color="blue-gray" className="font-medium">
                            Published
                          </Typography>
                          <Typography variant="small" color="gray">
                            Show this testimonial on the public website
                          </Typography>
                        </div>
                        <Switch
                          checked={formData.published}
                          onChange={(e) => handleInputChange('published', e.target.checked)}
                          color="teal"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography color="blue-gray" className="font-medium">
                            Featured
                          </Typography>
                          <Typography variant="small" color="gray">
                            Highlight this testimonial (appears first)
                          </Typography>
                        </div>
                        <Switch
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          color="orange"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outlined"
                      color="gray"
                      onClick={() => onClose()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="teal"
                      loading={loading}
                      className="flex-1"
                    >
                      {testimonial ? 'Update Testimonial' : 'Create Testimonial'}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Preview
                </Typography>
                
                <div className="text-center">
                  {/* Avatar Preview */}
                  {previewImage ? (
                    <div className="mb-4">
                      <Image
                        src={previewImage}
                        alt={formData.clientName || 'Client'}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                        onError={() => setPreviewImage('')}
                      />
                    </div>
                  ) : (
                    <div className="mb-4 mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Client Info */}
                  <div className="mb-4">
                    <Typography variant="h6" color="blue-gray">
                      {formData.clientName || 'Client Name'}
                    </Typography>
                    <Typography variant="small" color="gray" className="mb-2">
                      {formData.clientTitle || 'Client Title'}
                      {formData.company && ` @ ${formData.company}`}
                    </Typography>
                    
                    {/* Star Rating Preview */}
                    <div className="flex justify-center gap-1 mb-3">
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarSolidIcon
                          key={index}
                          className={`h-4 w-4 ${
                            index < formData.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Feedback Preview */}
                  <Typography variant="small" color="gray" className="italic">
                    &quot;{formData.feedback || 'Testimonial feedback will appear here...'}&quot;
                  </Typography>
                  
                  {/* Status Indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {formData.published && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Published
                      </div>
                    )}
                    {formData.featured && (
                      <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    {!formData.published && (
                      <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        Draft
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button,
  IconButton,
  Chip
} from '@material-tailwind/react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import AdminLayout from '@/components/admin/AdminLayout';
import TestimonialEditor from '@/components/admin/TestimonialEditor';
import { toast } from 'react-hot-toast';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const { getMaterialTailwindColor } = usePrimaryColor();
  const primaryColor = getMaterialTailwindColor();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?published=all');
      if (response.ok) {
        const data = await response.json();
        // Handle both array response (non-paginated) and object response (paginated)
        const testimonialsArray = Array.isArray(data) ? data : (data.testimonials || []);
        setTestimonials(testimonialsArray);
      } else {
        toast.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      toast.error('Failed to fetch testimonials');
      setTestimonials([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowEditor(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowEditor(true);
  };

  const handleDelete = async (testimonialId) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        toast.success('Testimonial deleted successfully');
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleTogglePublished = async (testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testimonial,
          published: !testimonial.published,
        }),
      });

      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(testimonials.map(t => 
          t.id === testimonial.id ? updatedTestimonial : t
        ));
        toast.success(`Testimonial ${updatedTestimonial.published ? 'published' : 'unpublished'}`);
      } else {
        toast.error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleToggleFeatured = async (testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testimonial,
          featured: !testimonial.featured,
        }),
      });

      if (response.ok) {
        const updatedTestimonial = await response.json();
        setTestimonials(testimonials.map(t => 
          t.id === testimonial.id ? updatedTestimonial : t
        ));
        toast.success(`Testimonial ${updatedTestimonial.featured ? 'featured' : 'unfeatured'}`);
      } else {
        toast.error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleEditorClose = (testimonial) => {
    setShowEditor(false);
    setEditingTestimonial(null);
    
    if (testimonial) {
      if (editingTestimonial) {
        // Update existing
        setTestimonials(testimonials.map(t => 
          t.id === testimonial.id ? testimonial : t
        ));
      } else {
        // Add new
        setTestimonials([testimonial, ...testimonials]);
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarSolidIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (showEditor) {
    return (
      <TestimonialEditor 
        testimonial={editingTestimonial}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Testimonials
            </Typography>
            <Typography color="gray">
              Manage client testimonials and reviews
            </Typography>
          </div>
          
          <Button
            color="teal"
            className="flex items-center gap-2"
            onClick={handleCreate}
          >
            <PlusIcon className="h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardBody className="text-center">
              <Typography variant="h4" color="blue-gray">
                {testimonials.length}
              </Typography>
              <Typography color="gray" className="text-sm">
                Total Testimonials
              </Typography>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <Typography variant="h4" color="teal">
                {testimonials.filter(t => t.published).length}
              </Typography>
              <Typography color="gray" className="text-sm">
                Published
              </Typography>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <Typography variant="h4" color="orange">
                {testimonials.filter(t => t.featured).length}
              </Typography>
              <Typography color="gray" className="text-sm">
                Featured
              </Typography>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <Typography variant="h4" color={primaryColor}>
                {testimonials.length > 0 
                  ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0'
                }
              </Typography>
              <Typography color="gray" className="text-sm">
                Avg Rating
              </Typography>
            </CardBody>
          </Card>
        </div>

        {/* Testimonials List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Typography variant="h6" color="gray" className="mb-2">
                    No testimonials yet
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Create your first testimonial to get started
                  </Typography>
                  <Button color="teal" onClick={handleCreate}>
                    Add Testimonial
                  </Button>
                </CardBody>
              </Card>
            ) : (
              Array.isArray(testimonials) && testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardBody>
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Avatar and basic info */}
                      <div className="flex items-start gap-4 flex-shrink-0">
                        {testimonial.avatarUrl ? (
                          <Image
                            src={testimonial.avatarUrl}
                            alt={testimonial.clientName}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <Typography variant="h6" color="blue-gray" className="mb-1">
                            {testimonial.clientName}
                          </Typography>
                          <Typography color="gray" className="text-sm mb-2">
                            {testimonial.clientTitle}
                            {testimonial.company && ` @ ${testimonial.company}`}
                          </Typography>
                          <div className="flex gap-1 mb-2">
                            {renderStars(testimonial.rating)}
                          </div>
                          <div className="flex gap-2">
                            {testimonial.published ? (
                              <Chip color={primaryColor} size="sm" value="Published" />
                            ) : (
                              <Chip color="gray" size="sm" value="Draft" />
                            )}
                            {testimonial.featured && (
                              <Chip color="orange" size="sm" value="Featured" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Typography color="gray" className="mb-4">
                          &quot;{testimonial.feedback}&quot;
                        </Typography>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <IconButton
                            variant="outlined"
                            color={primaryColor}
                            size="sm"
                            onClick={() => handleEdit(testimonial)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                          
                          <IconButton
                            variant="outlined"
                            color={testimonial.published ? "green" : "gray"}
                            size="sm"
                            onClick={() => handleTogglePublished(testimonial)}
                          >
                            {testimonial.published ? (
                              <EyeIcon className="h-4 w-4" />
                            ) : (
                              <EyeSlashIcon className="h-4 w-4" />
                            )}
                          </IconButton>
                          
                          <IconButton
                            variant="outlined"
                            color={testimonial.featured ? "orange" : "gray"}
                            size="sm"
                            onClick={() => handleToggleFeatured(testimonial)}
                          >
                            <StarIcon className="h-4 w-4" />
                          </IconButton>
                          
                          <IconButton
                            variant="outlined"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(testimonial.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

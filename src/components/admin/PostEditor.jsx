'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardBody, Input, Textarea, Button, Typography, Switch } from '@material-tailwind/react';
import { slugify, parseJSON } from '@/utils/helpers';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function PostEditor({ post, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      const tags = post.tags ? parseJSON(post.tags) : [];
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        published: post.published || false,
        tags: tags.join(', ') || '',
      });
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        slug: slugify(formData.title),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      await onSave(postData);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content,
    });
  };

  return (
    <Card>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-6">
          {post ? 'Edit Post' : 'Create New Post'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <Textarea
              label="Excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full"
            />
          </div>

          <div>
            <Typography color="blue-gray" className="mb-2 font-medium">
              Content
            </Typography>
            <div className="border border-gray-300 rounded-md">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike',
                  'list', 'bullet', 'link', 'image'
                ]}
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          <div>
            <Input
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <Typography color="blue-gray">
              Publish immediately
            </Typography>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              color="teal"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="gray"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

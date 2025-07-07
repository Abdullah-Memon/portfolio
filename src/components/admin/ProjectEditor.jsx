'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Typography, Input, Textarea, Button, Switch } from '@material-tailwind/react';

export default function ProjectEditor({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologies: [],
    category: '',
    featured: false,
    published: true,
  });
  
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        imageUrl: project.imageUrl || '',
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies || [],
        category: project.category || '',
        featured: project.featured || false,
        published: project.published !== undefined ? project.published : true,
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTechAdd = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleTechRemove = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleTechKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTechAdd();
    }
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-6 dark:text-white">
          {project ? 'Edit Project' : 'Create New Project'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Web Application, Mobile App, Full Stack"
              className="dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Short Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="dark:text-white"
            />
          </div>

          {/* Long Description */}
          <div>
            <Textarea
              label="Detailed Description"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={5}
              className="dark:text-white"
            />
          </div>

          {/* Image URL */}
          <div>
            <Input
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/project-image.jpg"
              className="dark:text-white"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Demo URL"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              placeholder="https://demo.example.com"
              className="dark:text-white"
            />
            <Input
              label="GitHub URL"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="dark:text-white"
            />
          </div>

          {/* Technologies */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
              Technologies Used
            </Typography>
            <div className="flex gap-2 mb-3">
              <Input
                label="Add Technology"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={handleTechKeyPress}
                placeholder="e.g., React, Node.js"
                className="flex-1 dark:text-white"
              />
              <Button
                type="button"
                color="teal"
                size="sm"
                onClick={handleTechAdd}
                disabled={!techInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleTechRemove(tech)}
                    className="ml-1 text-teal-600 dark:text-teal-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Switches */}
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                color="orange"
              />
              <Typography color="blue-gray" className="dark:text-gray-300">
                Featured Project
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                color="teal"
              />
              <Typography color="blue-gray" className="dark:text-gray-300">
                Published
              </Typography>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" color="teal" className="flex-1">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
            <Button type="button" variant="outlined" color="gray" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

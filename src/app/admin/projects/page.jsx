'use client';

import { useState, useEffect } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectEditor from '@/components/admin/ProjectEditor';
import ProjectList from '@/components/admin/ProjectList';
import toast from 'react-hot-toast';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowEditor(true);
  };

  const handleEditProject = (project) => {
    // Parse technologies if it's a string
    const projectWithParsedTech = {
      ...project,
      technologies: typeof project.technologies === 'string' 
        ? JSON.parse(project.technologies) 
        : project.technologies || []
    };
    setEditingProject(projectWithParsedTech);
    setShowEditor(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const loadingToast = toast.loading('Deleting project...');

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectId));
        
        // Revalidate projects page
        await fetch('/api/revalidate?path=/projects', {
          method: 'POST',
        });
        
        toast.success('Project deleted successfully!', { id: loadingToast });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete project', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  const handleSaveProject = async (projectData) => {
    const loadingToast = toast.loading(
      editingProject ? 'Updating project...' : 'Creating project...'
    );
    
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const savedProject = await response.json();
        
        if (editingProject) {
          setProjects(projects.map(project => 
            project.id === savedProject.id ? savedProject : project
          ));
        } else {
          setProjects([savedProject, ...projects]);
        }
        
        // Revalidate projects page
        await fetch('/api/revalidate?path=/projects', {
          method: 'POST',
        });
        
        setShowEditor(false);
        setEditingProject(null);
        
        toast.success(
          editingProject ? 'Project updated successfully!' : 'Project created successfully!',
          { id: loadingToast }
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save project', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Projects Management
            </Typography>
            <Typography color="gray">
              Manage your portfolio projects
            </Typography>
          </div>
          <Button 
            color="teal" 
            className="flex items-center gap-2"
            onClick={handleCreateProject}
          >
            <PlusIcon className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : showEditor ? (
          <ProjectEditor
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => {
              setShowEditor(false);
              setEditingProject(null);
            }}
          />
        ) : (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}
      </div>
    </AdminLayout>
  );
}

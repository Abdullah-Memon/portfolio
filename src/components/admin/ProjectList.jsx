'use client';

import { Card, CardBody, Typography, Button, Chip, Avatar } from '@material-tailwind/react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectList({ projects, onEdit, onDelete }) {
  // Ensure projects is an array
  const projectsList = Array.isArray(projects) ? projects : [];
  
  const getStatusColor = (published, featured) => {
    if (!published) return 'gray';
    if (featured) return 'orange';
    return 'teal';
  };

  const getStatusText = (published, featured) => {
    if (!published) return 'Draft';
    if (featured) return 'Featured';
    return 'Published';
  };

  return (
    <div className="space-y-4">
      {projectsList.length === 0 ? (
        <Card className="dark:bg-gray-800">
          <CardBody className="text-center py-12">
            <Typography variant="h6" color="blue-gray" className="mb-2 dark:text-white">
              No projects found
            </Typography>
            <Typography color="gray" className="dark:text-gray-300">
              Create your first project to get started.
            </Typography>
          </CardBody>
        </Card>
      ) : (
        projectsList.map((project) => (
          <Card key={project.id} className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardBody>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Project Image */}
                <div className="lg:w-32 lg:h-24 w-full h-48 flex-shrink-0">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Typography color="gray" className="text-sm dark:text-gray-400">
                        No Image
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <Typography variant="h6" color="blue-gray" className="dark:text-white truncate">
                        {project.title}
                      </Typography>
                      <Typography variant="small" color="gray" className="dark:text-gray-400">
                        {project.category || 'Uncategorized'} • Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Chip
                        value={getStatusText(project.published, project.featured)}
                        color={getStatusColor(project.published, project.featured)}
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                  </div>

                  <Typography color="gray" className="dark:text-gray-300 mb-3 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </Typography>

                  {/* Technologies */}
                  {project.technologies && JSON.parse(project.technologies).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {JSON.parse(project.technologies).slice(0, 4).map((tech, index) => (
                        <Chip
                          key={index}
                          value={tech}
                          variant="ghost"
                          color="teal"
                          size="sm"
                          className="text-xs"
                        />
                      ))}
                      {JSON.parse(project.technologies).length > 4 && (
                        <Chip
                          value={`+${JSON.parse(project.technologies).length - 4}`}
                          variant="ghost"
                          color="gray"
                          size="sm"
                          className="text-xs"
                        />
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.demoUrl && (
                      <Button
                        size="sm"
                        variant="outlined"
                        color="teal"
                        className="flex items-center gap-1"
                        onClick={() => window.open(project.demoUrl, '_blank')}
                      >
                        <i className="fas fa-external-link-alt text-xs"></i>
                        Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        size="sm"
                        variant="outlined"
                        color="gray"
                        className="flex items-center gap-1 dark:border-gray-600 dark:text-gray-300"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <i className="fab fa-github text-xs"></i>
                        Code
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="teal"
                      variant="outlined"
                      onClick={() => onEdit(project)}
                      className="flex items-center gap-1"
                    >
                      <i className="fas fa-edit text-xs"></i>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      variant="outlined"
                      onClick={() => onDelete(project.id)}
                      className="flex items-center gap-1"
                    >
                      <i className="fas fa-trash text-xs"></i>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}

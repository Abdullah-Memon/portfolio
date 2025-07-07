'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, CardBody, Chip, Button } from '@material-tailwind/react';
import Container from '@/components/ui/Container';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const { getBgColorClass } = usePrimaryColor();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        // Parse technologies JSON string back to array
        const projectsWithParsedTech = data.map(project => ({
          ...project,
          technologies: project.technologies ? JSON.parse(project.technologies) : []
        }));
        setProjects(projectsWithParsedTech);
        setFilteredProjects(projectsWithParsedTech);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from projects
  const getCategories = () => {
    const categories = ['All'];
    projects.forEach(project => {
      if (project.category && !categories.includes(project.category)) {
        categories.push(project.category);
      }
    });
    return categories;
  };

  // Filter projects based on selected criteria
  const filterProjects = () => {
    let filtered = projects;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(project => project.featured);
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [selectedCategory, showFeaturedOnly, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Floating Background Elements */}
      <div className="fixed inset-0  pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400/10 rounded-full animate-float animate-delay-200"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-teal-600/10 rounded-full animate-float animate-delay-400"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-teal-500/10 rounded-full animate-float animate-delay-600"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gray-900 dark:bg-gray-800 py-20">
        <Container>
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold heading-light mb-6">
              My Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up animate-delay-200">
              A showcase of my development work, featuring full-stack applications, 
              mobile apps, and innovative web solutions built with modern technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-400">
              <Chip 
                value={`${projects.length} Projects`} 
                className="bg-teal-500/20 text-teal-200 border border-teal-500/30"
              />
              <Chip 
                value={`${projects.filter(p => p.featured).length} Featured`} 
                className="bg-teal-500/20 text-teal-200 border border-teal-500/30"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {getCategories().map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "filled" : "outlined"}
                  color="teal"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Featured Filter */}
            <Button
              variant={showFeaturedOnly ? "filled" : "outlined"}
              color="orange"
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="transition-all duration-200"
            >
              <i className="fas fa-star mr-2"></i>
              {showFeaturedOnly ? "Show All" : "Featured Only"}
            </Button>
          </div>
        </Container>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <Container>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Typography variant="h4" color="blue-gray" className="mb-4 dark:text-white">
                No projects found
              </Typography>
              <Typography color="gray" className="dark:text-gray-300">
                {projects.length === 0 
                  ? "No projects have been added yet."
                  : "Try adjusting your filters to see more projects."
                }
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="group hover:shadow-xl transition-all duration-300 animate-fade-in-up dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Project Image */}
                  {project.imageUrl && (
                    <div className="relative h-48  rounded-t-lg">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <Chip
                            value="Featured"
                            className={`${getBgColorClass()} text-white`}
                            icon={<i className="fas fa-star text-xs"></i>}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <CardBody className="p-6">
                    {/* Project Title */}
                    <Typography variant="h5" color="blue-gray" className="mb-3 dark:text-white group-hover:text-teal-600 transition-colors">
                      {project.title}
                    </Typography>

                    {/* Project Description */}
                    <Typography color="gray" className="mb-4 dark:text-gray-300 line-clamp-3">
                      {project.description}
                    </Typography>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 4).map((tech, techIndex) => (
                          <Chip
                            key={techIndex}
                            value={tech}
                            variant="ghost"
                            color="teal"
                            className="text-xs"
                          />
                        ))}
                        {project.technologies.length > 4 && (
                          <Chip
                            value={`+${project.technologies.length - 4}`}
                            variant="ghost"
                            color="gray"
                            className="text-xs"
                          />
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      {project.demoUrl && (
                        <Button
                          size="sm"
                          color="teal"
                          variant="filled"
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => window.open(project.demoUrl, '_blank')}
                        >
                          <i className="fas fa-external-link-alt text-xs"></i>
                          Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          color="gray"
                          variant="outlined"
                          className="flex-1 flex items-center justify-center gap-2 dark:border-gray-600 dark:text-gray-300"
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <i className="fab fa-github text-xs"></i>
                          Code
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

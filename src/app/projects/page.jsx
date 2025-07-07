'use client';

import { useState, useEffect, useCallback } from 'react';
import { Typography, Card, CardBody, Chip, Button } from '@material-tailwind/react';
import Container from '@/components/ui/Container';
import Pagination from '@/components/ui/Pagination';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { getTextColorClass, getHoverTextColorClass, getBgColorClass, getSpinnerColorClass, getMaterialTailwindColor } = usePrimaryColor();

  // Intersection observer hooks
  const heroSection = useIntersectionObserver({ threshold: 0.2 })
  const filtersSection = useIntersectionObserver({ threshold: 0.2 })
  const projectsGridSection = useIntersectionObserver({ threshold: 0.1 })

  const PROJECTS_PER_PAGE = 6;

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: PROJECTS_PER_PAGE.toString(),
        published: 'true'
      });
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      if (showFeaturedOnly) {
        params.append('featured', 'true');
      }

      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        const projectsWithParsedTech = (data.projects || data).map(project => ({
          ...project,
          technologies: project.technologies ? JSON.parse(project.technologies) : []
        }));
        setProjects(projectsWithParsedTech);
        setFilteredProjects(projectsWithParsedTech);
        
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, showFeaturedOnly]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Get unique categories from projects (we'll fetch all for categories)
  const [allCategories, setAllCategories] = useState(['All']);
  
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await fetch('/api/projects?published=true&limit=1000');
        if (response.ok) {
          const data = await response.json();
          const allProjects = data.projects || data;
          const categories = ['All'];
          allProjects.forEach(project => {
            if (project.category && !categories.includes(project.category)) {
              categories.push(project.category);
            }
          });
          setAllCategories(categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchAllCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleFeaturedToggle = () => {
    setShowFeaturedOnly(!showFeaturedOnly);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getSpinnerColorClass()}`}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section ref={heroSection.ref} className="relative bg-primary-dynamic py-20">
        <Container>
          <div className={`text-center transition-all duration-700 ${heroSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h1 className={`text-4xl md:text-6xl font-bold heading-light mb-6 transition-all duration-700 delay-200 ${heroSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              My Projects
            </h1>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-8 transition-all duration-700 delay-300 ${heroSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              A showcase of my development work, featuring full-stack applications, 
              mobile apps, and innovative web solutions built with modern technologies.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-400 ${heroSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              <Chip 
                value={`${projects.length} Projects`} 
                className={`bg-white text-primary-dynamic border border-current/30`}
              />
              <Chip 
                value={`${projects.filter(p => p.featured).length} Featured`} 
                className={`text-white border border-current/30 bg-transparent`}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Filters Section */}
      <section ref={filtersSection.ref} className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className={`transition-all duration-700 ${filtersSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <CategoryFilter
              categories={allCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              showFeaturedToggle={true}
              showFeaturedOnly={showFeaturedOnly}
              onFeaturedToggle={handleFeaturedToggle}
              buttonSize="medium"
              className="justify-center"
            />
          </div>
        </Container>
      </section>

      {/* Projects Grid */}
      <section ref={projectsGridSection.ref} className="py-16">
        <Container>
          {filteredProjects.length === 0 ? (
            <div className={`text-center py-16 transition-all duration-700 ${projectsGridSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
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
                  className={`group hover:shadow-xl transition-all duration-700 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${projectsGridSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: projectsGridSection.isVisible ? `${index * 0.1}s` : '0s'}}
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={PROJECTS_PER_PAGE}
                onPageChange={handlePageChange}
                showInfo={true}
                showQuickJump={pagination.pages > 10}
                className="justify-center"
              />
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { formatDate, formatMonthYear, parseJSON } from '@/utils/helpers'
import { Container, Card, Counter } from '@/components/ui'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { usePrimaryColor } from '@/hooks/usePrimaryColor'

export default function AboutPage() {
  const [data, setData] = useState({
    profile: null,
    education: [],
    experience: [],
    skills: [],
    achievements: [],
    statistics: []
  })
  const [loading, setLoading] = useState(true)
  const { getSpinnerColorClass, getBgColorClass, getTextColorClass, getBadgeColorClass } = usePrimaryColor();

  // Intersection observer hooks for each section
  const heroSection = useIntersectionObserver({ threshold: 0.2 })
  const personalInfoSection = useIntersectionObserver({ threshold: 0.2 })
  const statsSection = useIntersectionObserver({ threshold: 0.2 })
  const experienceSection = useIntersectionObserver({ threshold: 0.1 })
  const educationSection = useIntersectionObserver({ threshold: 0.1 })
  const skillsSection = useIntersectionObserver({ threshold: 0.1 })
  const achievementsSection = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about')
        if (response.ok) {
          const aboutData = await response.json()
          setData(aboutData)
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getSpinnerColorClass()}`}></div>
      </div>
    )
  }

  const { profile, education, experience, skills, achievements, statistics } = data

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <>
      {/* Hero Section */}
      <div ref={heroSection.ref} className="bg-primary-dynamic pt-20 pb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-12 right-12 w-20 h-20 ${getBgColorClass()}/10 rounded-full transition-all duration-700 ${heroSection.isVisible ? 'animate-float' : 'opacity-0 scale-75'}`}></div>
          <div className={`absolute bottom-12 left-12 w-28 h-28 ${getBgColorClass()}/10 rounded-full transition-all duration-700 delay-200 ${heroSection.isVisible ? 'animate-float animate-delay-200' : 'opacity-0 scale-75'}`}></div>
        </div>
        
        <Container className="py-12 relative z-10">
          <div className="text-center">
            <h1 className={`text-5xl font-bold text-white mb-6 heading-primary transition-all duration-700 ${heroSection.isVisible ? 'animate-fade-in-down' : 'opacity-0 translate-y-8'}`}>
              About Me
            </h1>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${heroSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
              {profile?.bio || "Passionate full-stack developer with expertise in modern web technologies."}
            </p>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <Container className="py-12">
          <div ref={personalInfoSection.ref} className={`mb-12 transition-all duration-700 ${personalInfoSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <Card className="p-8 dark:bg-gray-800 dark:text-white hover-lift transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`transition-all duration-700 delay-200 ${personalInfoSection.isVisible ? 'animate-fade-in-left' : 'opacity-0 -translate-x-8'}`}>
                  <h2 className="text-2xl font-semibold mb-4 heading-dark">Personal Information</h2>
                  <div className="space-y-3 text-contrast">
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '0.5s' : '0s'}}><strong>Name:</strong> {profile?.name}</div>
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '0.6s' : '0s'}}><strong>Title:</strong> {profile?.title}</div>
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '0.7s' : '0s'}}><strong>Email:</strong> {profile?.email}</div>
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '0.8s' : '0s'}}><strong>Phone:</strong> {profile?.phone}</div>
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '0.9s' : '0s'}}><strong>Location:</strong> {profile?.location}</div>
                    <div className={`transition-all duration-500 ${personalInfoSection.isVisible ? '' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: personalInfoSection.isVisible ? '1.0s' : '0s'}}><strong>Website:</strong> 
                      <a href={profile?.website} className={`${getTextColorClass()} dark:text-primary-400 hover:underline ml-1`} target="_blank">
                        {profile?.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div className={`transition-all duration-700 delay-400 ${personalInfoSection.isVisible ? 'animate-fade-in-right' : 'opacity-0 translate-x-8'}`}>
                  <h2 className="text-2xl font-semibold mb-4 heading-dark">Connect With Me</h2>
                  <div className="space-y-3 text-contrast">
                    {profile?.linkedin && (
                      <div>
                        <strong>LinkedIn:</strong> 
                        <a href={profile.linkedin} className={`${getTextColorClass()} dark:text-primary-400 hover:underline ml-1`} target="_blank">
                          View Profile
                        </a>
                      </div>
                    )}
                    {profile?.github && (
                      <div>
                        <strong>GitHub:</strong> 
                        <a href={profile.github} className={`${getTextColorClass()} dark:text-primary-400 hover:underline ml-1`} target="_blank">
                          View Profile
                        </a>
                      </div>
                    )}
                    {profile?.twitter && (
                      <div>
                        <strong>Twitter:</strong> 
                        <a href={profile.twitter} className={`${getTextColorClass()} dark:text-primary-400 hover:underline ml-1`} target="_blank">
                          Follow Me
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics Section */}
          <div ref={statsSection.ref} className={`mb-12 transition-all duration-700 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <Card className="p-8 dark:bg-gray-800 dark:text-white">
              <h2 className={`text-3xl font-bold text-center mb-8 heading-dark transition-all duration-700 delay-200 ${statsSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
                Professional Journey
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {statistics && statistics.length > 0 ? (
                  statistics.map((stat, index) => (
                    <div key={stat.id} className={`transition-all duration-700 delay-${300 + (index * 100)} ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                      <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-1">
                        {stat.icon && <span className="mr-1">{stat.icon}</span>}
                        {statsSection.isVisible ? <Counter end={stat.value} suffix={stat.suffix || ''} /> : `0${stat.suffix || ''}`}
                      </div>
                      <p className="text-muted">{stat.label}</p>
                    </div>
                  ))
                ) : (
                  // Fallback to default statistics if none are configured
                  <>
                    <div className={`transition-all duration-700 delay-300 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                      <div className="text-4xl font-bold mb-2">
                        {statsSection.isVisible ? <Counter end={new Date().getFullYear() - 2018} suffix="+" /> : '0+'}
                      </div>
                      <p className="text-muted">Years Experience</p>
                    </div>
                    <div className={`transition-all duration-700 delay-400 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                      <div className="text-4xl font-bold mb-2">
                        {statsSection.isVisible ? <Counter end={skills.length} suffix="+" /> : '0+'}
                      </div>
                      <p className="text-muted">Skills Mastered</p>
                    </div>
                    <div className={`transition-all duration-700 delay-500 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                      <div className="text-4xl font-bold mb-2">
                        {statsSection.isVisible ? <Counter end={50} suffix="+" /> : '0+'}
                      </div>
                      <p className="text-muted">Projects Completed</p>
                    </div>
                    <div className={`transition-all duration-700 delay-600 ${statsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                      <div className="text-4xl font-bold mb-2">
                        {statsSection.isVisible ? <Counter end={achievements.length} /> : '0'}
                      </div>
                      <p className="text-muted">Achievements</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Experience Section */}
          <div ref={experienceSection.ref} className={`mb-12 transition-all duration-700 ${experienceSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h2 className={`text-3xl font-bold mb-6 heading-dark transition-all duration-700 delay-200 ${experienceSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <Card 
                  key={exp.id} 
                  className={`p-6 dark:bg-gray-800 hover-lift transition-all duration-700 ${experienceSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: experienceSection.isVisible ? `${(index + 1) * 0.1}s` : '0s'}}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold heading-dark">{exp.position}</h3>
                      <h4 className={`text-lg ${getTextColorClass()} dark:text-primary-400`}>{exp.company}</h4>
                      <p className="text-muted">{exp.location}</p>
                    </div>
                    <div className="text-right text-sm text-muted">
                      {formatMonthYear(exp.startDate)} - {exp.endDate ? formatMonthYear(exp.endDate) : 'Present'}
                    </div>
                  </div>
                  <p className="text-contrast mb-4">{exp.description}</p>
                  {exp.skills && (
                    <div className="flex flex-wrap gap-2">
                      {parseJSON(exp.skills).map((skill, index) => (
                        <span key={index} className={`px-2 py-1 ${getBadgeColorClass()} rounded text-sm`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div ref={educationSection.ref} className={`mb-12 transition-all duration-700 ${educationSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h2 className={`text-3xl font-bold mb-6 heading-dark transition-all duration-700 delay-200 ${educationSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card 
                  key={edu.id} 
                  className={`p-6 dark:bg-gray-800 hover-lift transition-all duration-700 ${educationSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: educationSection.isVisible ? `${(index + 1) * 0.1}s` : '0s'}}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold heading-dark">{edu.degree}</h3>
                      {edu.field && <h4 className={`text-lg ${getTextColorClass()} dark:text-primary-400`}>{edu.field}</h4>}
                      <p className="text-muted">{edu.institute}</p>
                      <p className="text-muted">{edu.location}</p>
                    </div>
                    <div className="text-right text-sm text-muted">
                      {formatMonthYear(edu.startDate)} - {edu.endDate ? formatMonthYear(edu.endDate) : 'Present'}
                    </div>
                  </div>
                  {edu.description && <p className="text-contrast mb-2">{edu.description}</p>}
                  {edu.grade && <p className="text-sm text-muted"><strong>Grade:</strong> {edu.grade}</p>}
                </Card>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div ref={skillsSection.ref} className={`mb-12 transition-all duration-700 ${skillsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h2 className={`text-3xl font-bold mb-6 heading-dark transition-all duration-700 delay-200 ${skillsSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
              Skills & Expertise
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                <Card 
                  key={category} 
                  className={`p-6 dark:bg-gray-800 hover-lift transition-all duration-700 ${skillsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: skillsSection.isVisible ? `${(index + 1) * 0.1}s` : '0s'}}
                >
                  <h3 className="text-lg font-semibold mb-4 capitalize heading-dark">{category} Skills</h3>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-contrast">{skill.name}</span>
                          <span className="text-sm text-muted capitalize">{skill.level}</span>
                        </div>
                        {skill.description && (
                          <p className="text-sm text-muted">{skill.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div ref={achievementsSection.ref} className={`mb-12 transition-all duration-700 ${achievementsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
              <h2 className={`text-3xl font-bold mb-6 heading-dark transition-all duration-700 delay-200 ${achievementsSection.isVisible ? '' : 'opacity-0 translate-y-4'}`}>
                Achievements & Certifications
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={achievement.id} 
                    className={`p-6 dark:bg-gray-800 hover-lift transition-all duration-700 ${achievementsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                    style={{transitionDelay: achievementsSection.isVisible ? `${(index + 1) * 0.1}s` : '0s'}}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold heading-dark">{achievement.title}</h3>
                      <span className="text-sm text-muted">{formatDate(achievement.date)}</span>
                    </div>
                    {achievement.organization && (
                      <p className={`${getTextColorClass()} dark:text-primary-400 mb-2`}>{achievement.organization}</p>
                    )}
                    {achievement.description && (
                      <p className="text-contrast">{achievement.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  )
}

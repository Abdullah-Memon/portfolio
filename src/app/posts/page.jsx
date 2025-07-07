'use client';

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { formatDate, truncateText, parseJSON } from '@/utils/helpers'
import { Container, Card } from '@/components/ui'
import Pagination from '@/components/ui/Pagination'
import CategoryFilter from '@/components/ui/CategoryFilter'
import { usePrimaryColor } from '@/hooks/usePrimaryColor'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [searchLoading, setSearchLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([]) // Store all posts for category filtering
  const { getTextColorClass, getHoverTextColorClass, getBgColorClass, getSpinnerColorClass, getButtonColorClass, getBadgeColorClass, getRingColorClass } = usePrimaryColor();

  const POSTS_PER_PAGE = 9

  const fetchPosts = useCallback(async (page = 1, search = '', category = 'All') => {
    try {
      setSearchLoading(true)
      const params = new URLSearchParams({
        published: 'true',
        page: page.toString(),
        limit: POSTS_PER_PAGE.toString()
      })
      
      if (search.trim()) {
        params.append('search', search.trim())
      }

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        let filteredPosts = data.posts || []
        
        // Store all posts for category filtering
        if (page === 1 && !search) {
          setAllPosts(filteredPosts)
        }
        
        // Filter by category if not "All"
        if (category !== 'All') {
          filteredPosts = filteredPosts.filter(post => {
            const tags = parseJSON(post.tags) || []
            return tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
          })
        }
        
        setPosts(filteredPosts)
        setPagination(data.pagination || {})
      } else {
        console.error('Failed to fetch posts')
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1, searchQuery, selectedCategory)
  }, [fetchPosts, searchQuery, selectedCategory])

  // Get unique categories from all posts' tags
  const getCategories = () => {
    const categories = ['All']
    const allTags = new Set()
    
    allPosts.forEach(post => {
      const tags = parseJSON(post.tags) || []
      tags.forEach(tag => {
        if (tag.trim()) {
          allTags.add(tag.trim())
        }
      })
    })
    
    return [...categories, ...Array.from(allTags).sort()]
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSearchQuery('') // Clear search when changing category
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchPosts(page, searchQuery, selectedCategory)
    // Scroll to top of posts section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }



  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary-dynamic pt-20 pb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-16 w-24 h-24 bg-primary-10 rounded-full animate-float"></div>
          <div className={`absolute bottom-16 right-16 w-32 h-32 ${getBgColorClass()}/10 rounded-full animate-float animate-delay-300`}></div>
        </div>
        
        <Container className="py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6 heading-primary animate-fade-in-down">Blog & Articles</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Sharing insights, tutorials, and thoughts on web development, technology, and software engineering.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto animate-fade-in-up animate-delay-300 ">
              <div className="relative">
                <div className="absolute  inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-primary-dynamic" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-white text-primary-dynamic placeholder-gray-400 focus:outline-none focus:ring-2 ${getRingColorClass()} focus:border-transparent backdrop-blur-sm transition-all`}
                />
                {searchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${getSpinnerColorClass()}`}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            {getCategories().length > 1 && (
              <div className="mt-6 animate-fade-in-up animate-delay-400">
                <CategoryFilter
                  categories={getCategories()}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  buttonSize="small"
                  className="justify-center max-w-4xl mx-auto"
                />
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <Container className="py-12">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {searchLoading ? (
                  'Searching...'
                ) : (
                  <>
                    Found {pagination.total || 0} result{pagination.total !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                  </>
                )}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getSpinnerColorClass()}`}></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                {searchQuery ? 'No posts found' : 'No posts yet'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all posts.'
                  : 'Check back soon for new content!'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`mt-4 px-4 py-2 ${getButtonColorClass()} text-white rounded-lg transition-colors`}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <Card 
                    key={post.id} 
                    className="hover-lift hover-glow transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {post.imageUrl && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg  relative group">
                        <Image 
                          src={post.imageUrl} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {post.featured && (
                        <span className={`inline-block px-2 py-1 ${getBadgeColorClass()} text-xs font-medium rounded mb-3 animate-pulse`}>
                          Featured
                        </span>
                      )}
                      
                      <h2 className={`text-xl font-semibold mb-3 text-gray-900 dark:text-white ${getHoverTextColorClass()} dark:hover:text-primary-400 transition-colors`}>
                        <Link href={`/posts/${post.slug}`} className="hover-scale block">
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, '').replace(/#/g, '').replace(/\n/g, ' '))}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <Link 
                          href={`/posts/${post.slug}`}
                          className={`${getTextColorClass()} dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium transition-colors`}
                        >
                          Read more →
                        </Link>
                      </div>
                      
                      {post.tags && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {parseJSON(post.tags).slice(0, 3).map((tag, index) => (
                            <button 
                              key={index}
                              className={`px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs transition-all duration-200 cursor-pointer ${getHoverTextColorClass()} hover:shadow-md transform hover:scale-105 ${
                                selectedCategory === tag ? `${getBgColorClass()} text-white` : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                              onClick={() => handleCategoryChange(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.pages}
                  totalItems={pagination.total}
                  itemsPerPage={POSTS_PER_PAGE}
                  onPageChange={handlePageChange}
                  showInfo={true}
                  showQuickJump={pagination.pages > 10}
                  className="mt-12"
                />
              )}
            </>
          )}
        </Container>
      </div>
    </>
  )
}

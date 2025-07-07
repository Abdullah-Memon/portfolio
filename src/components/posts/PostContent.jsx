'use client';

import Container from '@/components/ui/Container';
import { formatDate, parseJSON } from '@/utils/helpers';
import { usePrimaryColor } from '@/hooks/usePrimaryColor';

export default function PostContent({ post }) {
  // Parse tags safely
  const tags = post.tags ? parseJSON(post.tags) : [];
  const { primary, getHoverTextColorClass } = usePrimaryColor();

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gray-900 dark:bg-gray-800 pt-20 pb-16">
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <header className="text-center">
              <h1 className="mb-6 text-4xl lg:text-5xl font-bold text-white heading-primary animate-fade-in-down">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="mb-6 text-xl text-gray-300 leading-relaxed animate-fade-in-up animate-delay-200">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap justify-center items-center gap-4 mb-6 animate-fade-in-up animate-delay-300">
                <span className="text-sm text-gray-400">
                  Published on {formatDate(post.createdAt)}
                </span>
                
                {post.updatedAt !== post.createdAt && (
                  <span className="text-sm text-gray-400">
                    Updated on {formatDate(post.updatedAt)}
                  </span>
                )}
              </div>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up animate-delay-400">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 ${primary.bg20} ${primary.text} rounded-full text-sm border ${primary.border} border-opacity-30 hover-scale`}
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <Container className="py-12">
          <article className="max-w-4xl mx-auto animate-fade-in-up animate-delay-500">
            {/* Content */}
            <div 
              className="text-gray-800 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                color: '#1f2937',
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            />
            
            <style jsx>{`
              .text-gray-800 h1, .text-gray-800 h2, .text-gray-800 h3, .text-gray-800 h4, .text-gray-800 h5, .text-gray-800 h6 {
                color: #111827 !important;
                font-weight: bold !important;
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
              }
              .text-gray-800 h1 { font-size: 2rem !important; }
              .text-gray-800 h2 { font-size: 1.75rem !important; }
              .text-gray-800 h3 { font-size: 1.5rem !important; }
              .text-gray-800 h4 { font-size: 1.25rem !important; }
              .text-gray-800 h5 { font-size: 1.125rem !important; }
              .text-gray-800 h6 { font-size: 1rem !important; }
              
              .text-gray-800 p {
                color: #374151 !important;
                margin-bottom: 1rem !important;
                line-height: 1.7 !important;
              }
              
              .text-gray-800 ul, .text-gray-800 ol {
                color: #374151 !important;
                margin: 1rem 0 !important;
                padding-left: 2rem !important;
              }
              
              .text-gray-800 li {
                color: #374151 !important;
                margin-bottom: 0.5rem !important;
              }
              
              .text-gray-800 strong {
                color: #111827 !important;
                font-weight: bold !important;
              }
              
              .text-gray-800 em {
                font-style: italic !important;
              }
              
              .text-gray-800 a {
                color: var(--color-primary, #0891b2) !important;
                text-decoration: underline !important;
              }
              
              .text-gray-800 a:hover {
                color: var(--color-primary-light, #0e7490) !important;
              }
              
              .text-gray-800 blockquote {
                border-left: 4px solid var(--color-primary, #0891b2) !important;
                padding-left: 1rem !important;
                margin: 1.5rem 0 !important;
                font-style: italic !important;
                color: #6b7280 !important;
              }
            `}</style>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up animate-delay-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Written by Abdullah Memon
                </p>
                
                <div className="flex gap-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share this post:
                  </p>
                  <div className="flex gap-2">
                    {/* Twitter Share */}
                    <button
                      onClick={() => {
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                        window.open(twitterUrl, '_blank', 'width=550,height=420');
                      }}
                      className={`text-gray-600 dark:text-gray-400 transition-colors ${getHoverTextColorClass()}`}
                      title="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>

                    {/* Facebook Share */}
                    <button
                      onClick={() => {
                        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                        window.open(facebookUrl, '_blank', 'width=550,height=420');
                      }}
                      className={`text-gray-600 dark:text-gray-400 transition-colors ${getHoverTextColorClass()}`}
                      title="Share on Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    {/* LinkedIn Share */}
                    <button
                      onClick={() => {
                        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                        window.open(linkedinUrl, '_blank', 'width=550,height=420');
                      }}
                      className={`text-gray-600 dark:text-gray-400 transition-colors ${getHoverTextColorClass()}`}
                      title="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                          // You could add a toast notification here
                          alert('Link copied to clipboard!');
                        });
                      }}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy link"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>

                    {/* WhatsApp Share */}
                    <button
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + window.location.href)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </article>

          {/* Related Posts or Navigation */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up animate-delay-800">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold heading-dark">
                More Posts
              </h4>
              <a
                href="/posts"
                className={`${primary.text} hover:${primary.text} dark:${primary.text} dark:hover:${primary.text} font-medium transition-colors hover-scale`}
              >
                View all posts →
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

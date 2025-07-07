'use client';

import { Card, CardBody, Typography, Button, Badge, Chip } from '@material-tailwind/react';
import { formatDistanceToNow } from 'date-fns';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { parseJSON } from '@/utils/helpers';

export default function PostList({ posts, onEdit, onDelete }) {
  // Ensure posts is an array
  const postsList = Array.isArray(posts) ? posts : [];
  
  return (
    <div className="space-y-4">
      {postsList.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Typography color="gray">
              No posts yet. Create your first post to get started!
            </Typography>
          </CardBody>
        </Card>
      ) : (
        postsList.map((post) => {
          const tags = post.tags ? parseJSON(post.tags) : [];
          return (
            <Card key={post.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge
                        color={post.published ? 'green' : 'gray'}
                        value={post.published ? 'Published' : 'Draft'}
                      />
                      <Typography variant="h6" color="blue-gray">
                        {post.title}
                      </Typography>
                    </div>
                    
                    {post.excerpt && (
                      <Typography color="gray" className="mb-3">
                        {post.excerpt}
                      </Typography>
                    )}

                    {post.content && (
                      <div className="mb-3">
                        <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                          Content Preview:
                        </Typography>
                        <div 
                          className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-3 rounded border overflow-y-auto"
                          dangerouslySetInnerHTML={{ 
                            __html: post.content.length > 200 
                              ? post.content.substring(0, 200) + '...' 
                              : post.content 
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      {post.updatedAt !== post.createdAt && (
                        <span>
                          Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>

                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            value={tag}
                            size="sm"
                            color="teal"
                            variant="ghost"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {post.published && (
                      <Button
                        size="sm"
                        variant="outlined"
                        color="teal"
                        className="flex items-center gap-1"
                        onClick={() => window.open(`/posts/${post.slug}`, '_blank')}
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outlined"
                      color="blue-gray"
                      className="flex items-center gap-1"
                      onClick={() => onEdit(post)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="red"
                      className="flex items-center gap-1"
                      onClick={() => onDelete(post.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })
      )}
    </div>
  );
}

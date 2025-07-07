'use client';

import { useState, useEffect } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import AdminLayout from '@/components/admin/AdminLayout';
import PostEditor from '@/components/admin/PostEditor';
import PostList from '@/components/admin/PostList';
import toast from 'react-hot-toast';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const loadingToast = toast.loading('Deleting post...');

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        
        // Revalidate posts page
        await fetch('/api/revalidate?path=/posts', {
          method: 'POST',
        });
        
        toast.success('Post deleted successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to delete post', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  const handleSavePost = async (postData) => {
    const loadingToast = toast.loading(editingPost ? 'Updating post...' : 'Creating post...');
    
    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const savedPost = await response.json();
        if (editingPost) {
          setPosts(posts.map(post => 
            post.id === savedPost.id ? savedPost : post
          ));
        } else {
          setPosts([savedPost, ...posts]);
        }
        
        // Revalidate posts page and individual post page
        await fetch('/api/revalidate?path=/posts', {
          method: 'POST',
        });
        
        if (savedPost.slug) {
          await fetch(`/api/revalidate?path=/posts/${savedPost.slug}`, {
            method: 'POST',
          });
        }
        
        setShowEditor(false);
        setEditingPost(null);
        
        toast.success(editingPost ? 'Post updated successfully!' : 'Post created successfully!', { id: loadingToast });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save post', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Manage Posts
            </Typography>
            <Typography color="gray">
              Create, edit, and manage your blog posts
            </Typography>
          </div>
          <Button 
            onClick={handleCreatePost}
            color="teal"
            className="flex items-center gap-2"
          >
            Create New Post
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : showEditor ? (
          <PostEditor
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => {
              setShowEditor(false);
              setEditingPost(null);
            }}
          />
        ) : (
          <PostList
            posts={posts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        )}
      </div>
    </AdminLayout>
  );
}

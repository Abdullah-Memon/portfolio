import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostContent from '@/components/posts/PostContent';

// Disable static generation for this dynamic route during build
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // For build time, return empty array to avoid database access
  // Static generation will be handled at runtime
  return [];
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Abdullah Memon`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
  };
}

async function getPost(slug) {
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug,
        published: true,
      },
    });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}

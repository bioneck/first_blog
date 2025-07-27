import Link from 'next/link';
import { Suspense } from 'react';

interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch('/api/posts', { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="border rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">
        <Link href={`/posts/${post.slug}`}>
          {post.title}
        </Link>
      </h2>
      <div className="text-gray-500 mb-4">
        {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <p className="text-gray-700 mb-4">
        {post.content.length > 150
          ? `${post.content.substring(0, 150)}...`
          : post.content}
      </p>
      <Link
        href={`/posts/${post.slug}`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Read more →
      </Link>
    </article>
  );
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Personal Blog</h1>
        <p className="text-gray-600 text-lg">
          Thoughts, tutorials, and ideas about programming and web development
        </p>
      </header>

      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsSection />
      </Suspense>
    </main>
  );
}

async function PostsSection() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium mb-4">No posts yet</h2>
        <p className="text-gray-500">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

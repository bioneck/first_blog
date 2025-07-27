import Link from 'next/link';
import { Suspense } from 'react';
import { headers } from 'next/headers';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  slug: string;
  published: boolean;
}

async function getPosts(): Promise<Post[]> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const res = await fetch(`${protocol}://${host}/api/posts`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
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
        阅读更多 →
      </Link>
    </article>
  );
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">我的个人博客</h1>
        <p className="text-gray-600 text-lg">
          关于编程和Web开发的思考、教程和想法
        </p>
      </header>

      <Suspense fallback={<div>加载文章中...</div>}>
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
        <h2 className="text-2xl font-medium mb-4">暂无文章</h2>
        <p className="text-gray-500">敬请期待新内容！</p>
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

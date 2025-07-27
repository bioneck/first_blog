import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/app/models/Post';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
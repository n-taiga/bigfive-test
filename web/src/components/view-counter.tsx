import { kv } from '@vercel/kv';
import { unstable_noStore as noStore } from 'next/cache';

interface ViewCounterProps {
  postId: string;
}

export async function ViewCounter({ postId }: ViewCounterProps) {
  'use server';
  noStore();
  // If Vercel KV is not configured locally, avoid throwing and just show 0.
  const hasKvConfig =
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!hasKvConfig) {
    return <p>0 views</p>;
  }

  try {
    const views = await kv.incr(postId.replace('.md', ''));
    return <p>{Intl.NumberFormat('en-us').format(views)} views</p>;
  } catch (err) {
    console.error('KV view counter error', err);
    return <p>0 views</p>;
  }
}

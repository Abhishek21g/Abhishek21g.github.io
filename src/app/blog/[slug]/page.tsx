import { notFound } from 'next/navigation';
import Image from 'next/image';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
};
const posts: BlogPost[] = [];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Image src={post.image} alt={post.title} width={800} height={400} className="rounded-xl w-full h-80 object-cover" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-white">{post.title}</h1>
        <div className="text-gray-400 mb-6">{post.date}</div>
        <div className="text-lg text-gray-200 whitespace-pre-line mb-8">{post.content}</div>
        <a href="/blog" className="text-blue-400 hover:underline">← Back to Blog</a>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  // Replace this with your actual slugs source (e.g., from a CMS, file system, etc.)
  return [
    { slug: 'first-post' },
    { slug: 'second-post' },
    { slug: 'third-post' },
  ];
} 
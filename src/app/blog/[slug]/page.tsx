import { notFound } from 'next/navigation';
import Image from 'next/image';

const posts = [
  {
    slug: 'skydiving-adventure',
    title: 'Skydiving Adventure',
    excerpt: 'Jumped out of a plane. 10/10 would recommend. Read for the full adrenaline rush.',
    date: 'March 2024',
    image: '/images/skydiving.jpg',
    content: `I finally did it: jumped out of a perfectly good airplane! The freefall was pure chaos, the view was unreal, and the adrenaline rush was next level. Would I do it again? Absolutely. If you ever get the chance, just send it!`,
  },
  {
    slug: 'sc24-experience',
    title: 'Supercomputing Conference 2024',
    excerpt: 'Represented OSU at SC24, presenting our digital twin project and connecting with global leaders in HPC and AI.',
    date: 'November 2024',
    image: '/images/IMG_9530.JPG',
    content: `This year, through Oregon State, I had the incredible privilege of representing Oregon State University at the Supercomputing Conference (SC24) in Atlanta. It marked the first-ever appearance for both OSU and Link Oregon at SC, and I'm happy to be a part in this big milestone!

At the conference, I presented a digital twin of the Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex's building's server room, using NVIDIA Omniverse. Our presentation's high point was an immersive virtual reality walkthrough that let participants visually explore the area and understand how this technology may be applied.

Thank you to everyone who supported and made this possible. SC24 was more than just a conference—it was a platform to share my vision, connect with global leaders, and demonstrate how OSU is at the forefront of innovation in high-performance computing and data center design.`,
  },
];

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
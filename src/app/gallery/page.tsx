import Image from 'next/image'

const photos = [
  '/images/IMG_9530.JPG',
  '/images/IMG_7597 2.jpg',
  '/images/IMG_7596 2.jpg',
  '/images/IMG_4193 2.jpg',
];

export default function UnemployedAdventuresPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center text-white">Unemployed Adventures</h1>
      <div className="flex flex-col gap-12 max-w-2xl mx-auto">
        {photos.map((src, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <Image src={src} alt={`Unemployed Adventure ${i + 1}`} fill className="object-cover w-full h-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 
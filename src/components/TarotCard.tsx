import Link from 'next/link';
import Image from 'next/image';

interface TarotCardProps {
  dreamId: string;
  title: string;
  tarotImageBase64: string | null;
  mood: string | null;
  createdAt: Date;
}

export default function TarotCard({
  dreamId,
  title,
  tarotImageBase64,
  mood,
  createdAt,
}: TarotCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/dream/${dreamId}`}
      className="group block bg-gray-900 border-2 border-purple-900 rounded-lg overflow-hidden hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
    >
      <div className="aspect-[2/3] bg-gradient-to-b from-purple-950 to-gray-950 relative">
        {tarotImageBase64 ? (
          <img
            src={tarotImageBase64}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-6xl mb-4">🌙</div>
              <div className="text-purple-300 text-sm">Tarot card generating...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-950 border-t-2 border-purple-900">
        <h3 className="text-lg font-semibold text-purple-100 mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-sm">
          {mood && (
            <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">
              {mood}
            </span>
          )}
          <span className="text-gray-400 text-xs ml-auto">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}

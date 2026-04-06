import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

interface Dream {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  tarot_image_base64: string | null;
  created_at: Date;
}

interface Match {
  story: string;
}

export default async function DreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch dream by ID
  const dreamResult = await query<Dream>(
    `SELECT id, user_id, title, content, mood, tarot_image_base64, created_at
     FROM dreams
     WHERE id = $1`,
    [id]
  );

  if (dreamResult.rows.length === 0) {
    notFound();
  }

  const dream = dreamResult.rows[0];

  // Verify dream belongs to current user
  if (dream.user_id !== session.user.id) {
    notFound();
  }

  // Check if dream has any matches
  const matchResult = await query<Match>(
    `SELECT m.story
     FROM matches m
     JOIN dream_matches dm ON dm.match_id = m.id
     WHERE dm.dream_id = $1
     LIMIT 1`,
    [id]
  );

  const match = matchResult.rows.length > 0 ? matchResult.rows[0] : null;

  const formattedDate = new Date(dream.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="text-purple-400 hover:text-purple-300 transition-colors mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Dream Content */}
        <div className="bg-gray-900 border-2 border-purple-900 rounded-lg overflow-hidden">
          {/* Tarot Image */}
          {dream.tarot_image_base64 ? (
            <div className="w-full max-w-md mx-auto p-6">
              <div className="border-4 border-purple-600 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/50">
                <img
                  src={dream.tarot_image_base64}
                  alt={dream.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto p-6">
              <div className="aspect-[2/3] bg-gradient-to-b from-purple-950 to-gray-950 border-4 border-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌙</div>
                  <div className="text-purple-300">Tarot card generating...</div>
                </div>
              </div>
            </div>
          )}

          {/* Dream Details */}
          <div className="p-8">
            {/* Title and Metadata */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
                {dream.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{formattedDate}</span>
                {dream.mood && (
                  <>
                    <span>•</span>
                    <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                      {dream.mood}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-950 border-l-4 border-purple-600 p-6 rounded mb-8">
              <h2 className="text-lg font-semibold text-purple-300 mb-3">Dream Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {dream.content}
              </p>
            </div>

            {/* Match Story */}
            {match && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-600 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✨</span>
                  <h2 className="text-xl font-semibold text-purple-300">
                    Connected Story
                  </h2>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {match.story}
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/matches"
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    View all matches →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

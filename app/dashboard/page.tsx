import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import TarotCard from '@/components/TarotCard';

interface Dream {
  id: string;
  title: string;
  tarot_image_base64: string | null;
  mood: string | null;
  created_at: Date;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch all dreams for current user
  const result = await query<Dream>(
    `SELECT id, title, tarot_image_base64, mood, created_at
     FROM dreams
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [session.user.id]
  );

  const dreams = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Your Dream Journal
          </h1>
          <p className="text-gray-400">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/dashboard/submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50"
          >
            ✨ Submit a Dream
          </Link>
          <Link
            href="/dashboard/matches"
            className="px-6 py-3 bg-gray-800 border-2 border-purple-600 text-purple-300 font-semibold rounded-lg hover:bg-purple-900/30 transition-all"
          >
            🔮 View Matches
          </Link>
        </div>

        {/* Dreams Grid */}
        {dreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌙</div>
            <h2 className="text-2xl text-purple-300 mb-2">No dreams yet</h2>
            <p className="text-gray-400 mb-6">Start your journey by submitting your first dream</p>
            <Link
              href="/dashboard/submit"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Submit Your First Dream
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dreams.map((dream) => (
              <TarotCard
                key={dream.id}
                dreamId={dream.id}
                title={dream.title}
                tarotImageBase64={dream.tarot_image_base64}
                mood={dream.mood}
                createdAt={dream.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

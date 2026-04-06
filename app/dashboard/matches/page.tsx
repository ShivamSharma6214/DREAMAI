import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

interface Match {
  match_id: string;
  story: string;
  created_at: Date;
  dream_count: number;
}

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch all matches for current user
  const result = await query<Match>(
    `SELECT
      m.id as match_id,
      m.story,
      m.created_at,
      COUNT(dm.dream_id) as dream_count
     FROM matches m
     JOIN dream_matches dm ON dm.match_id = m.id
     WHERE m.id IN (
       SELECT DISTINCT match_id
       FROM dream_matches
       WHERE dream_id IN (
         SELECT id FROM dreams WHERE user_id = $1
       )
     )
     GROUP BY m.id, m.story, m.created_at
     ORDER BY m.created_at DESC`,
    [session.user.id]
  );

  const matches = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Dream Matches
          </h1>
          <p className="text-gray-400">
            Discover the connections between your dreams and others
          </p>
        </div>

        {/* Matches List */}
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl text-purple-300 mb-2">No matches yet</h2>
            <p className="text-gray-400 mb-6">
              Keep submitting dreams to find connections with other dreamers
            </p>
            <Link
              href="/dashboard/submit"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Submit a Dream
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => {
              const formattedDate = new Date(match.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={match.match_id}
                  className="bg-gray-900 border-2 border-purple-900 rounded-lg p-6 hover:border-purple-600 transition-colors"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                        🌟
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300">
                          Connection Found
                        </h3>
                        <p className="text-sm text-gray-400">
                          {match.dream_count} dreams connected • {formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Story */}
                  <div className="bg-gray-950 border-l-4 border-purple-600 p-4 rounded">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {match.story}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

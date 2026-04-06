import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateMatchStory } from '@/lib/groq';
import { sendMatchEmail } from '@/lib/email';

interface Dream {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  embedding: string;
}

interface SimilarDream {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  similarity: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dreamId = searchParams.get('dreamId');

    if (!dreamId) {
      return NextResponse.json(
        { error: 'dreamId query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch the submitted dream
    const dreamResult = await query<Dream>(
      'SELECT id, user_id, title, content, mood, embedding FROM dreams WHERE id = $1',
      [dreamId]
    );

    if (dreamResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }

    const submittedDream = dreamResult.rows[0];

    const debugResult = await query(
      `SELECT id, title, user_id,
       (1 - (embedding <=> $1::vector)) as similarity
       FROM dreams 
       WHERE user_id != $2 AND embedding IS NOT NULL`,
      [submittedDream.embedding, submittedDream.user_id]
    );
    console.log('DEBUG similarity scores:', JSON.stringify(debugResult.rows));

    // Find similar dreams from OTHER users using cosine similarity
    const similarDreamsResult = await query<SimilarDream>(
      `SELECT
        d.id,
        d.user_id,
        d.title,
        d.content,
        d.mood,
        (1 - (d.embedding <=> $1::vector)) AS similarity
      FROM dreams d
      WHERE d.user_id != $2
        AND d.embedding IS NOT NULL
        AND (1 - (d.embedding <=> $1::vector)) > 0.60
      ORDER BY similarity DESC
      LIMIT 5`,
      [submittedDream.embedding, submittedDream.user_id]
    );

    const similarDreams = similarDreamsResult.rows;

    console.log(`Found ${similarDreams.length} similar dreams for dream ${dreamId}`);

    // If fewer than 1 match, do nothing
    if (similarDreams.length < 1) {
      return NextResponse.json({
        message: 'Not enough matches found',
        matchCount: similarDreams.length,
      });
    }

    // Create match record
    const matchResult = await query<{ id: string }>(
      'INSERT INTO matches (story) VALUES ($1) RETURNING id',
      [''] // Placeholder, will update with generated story
    );

    const matchId = matchResult.rows[0].id;

    // Insert dream_matches for all dreams (submitted + matched)
    const allDreamIds = [submittedDream.id, ...similarDreams.map(d => d.id)];

    for (const dId of allDreamIds) {
      await query(
        'INSERT INTO dream_matches (dream_id, match_id) VALUES ($1, $2)',
        [dId, matchId]
      );
    }

    console.log(`Created match ${matchId} with ${allDreamIds.length} dreams`);

    // Prepare dream fragments for story generation
    const dreamFragments = [
      {
        title: submittedDream.title,
        content: submittedDream.content,
        mood: submittedDream.mood || undefined,
      },
      ...similarDreams.map(d => ({
        title: d.title,
        content: d.content,
        mood: d.mood || undefined,
      })),
    ];

    // Generate cohesive story using Groq
    let story: string;
    try {
      story = await generateMatchStory(dreamFragments);
    } catch (error) {
      console.error('Story generation error:', error);
      // Use a fallback story if Groq fails
      story = `A connection has been found between ${allDreamIds.length} dreams. The dreams share common themes and symbols that weave together across the subconscious minds of different dreamers.`;
    }

    // Update match with generated story
    await query(
      'UPDATE matches SET story = $1 WHERE id = $2',
      [story, matchId]
    );

    console.log(`Updated match ${matchId} with generated story`);

    // Get all user IDs involved in this match
    const allUserIds = [submittedDream.user_id, ...similarDreams.map(d => d.user_id)];

    // Fetch emails for all matched users
    const emailsResult = await query<{ email: string }>(
      'SELECT email FROM users WHERE id = ANY($1::uuid[])',
      [allUserIds]
    );

    const userEmails = emailsResult.rows.map(row => row.email);

    // Send notification emails (fire-and-forget, fails silently)
    if (userEmails.length > 0) {
      sendMatchEmail(userEmails, story, matchId).catch(err => {
        console.error('Failed to send match emails:', err);
      });
    }

    return NextResponse.json({
      message: 'Match created successfully',
      matchId,
      dreamCount: allDreamIds.length,
      matchedDreams: similarDreams.map(d => ({
        id: d.id,
        title: d.title,
        similarity: d.similarity,
      })),
    });
  } catch (error) {
    console.error('Dream matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

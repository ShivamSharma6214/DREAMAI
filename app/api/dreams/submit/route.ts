import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { generateDreamEmbedding } from '@/lib/embeddings';
import { getRandomTarotCard } from '@/lib/tarotImages';

interface Dream {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  tarot_image_base64: string | null;
  created_at: Date;
}

export async function POST(req: NextRequest) {
  try {
    // Validate authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { title, content, mood } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return NextResponse.json(
        { error: 'Title must be 255 characters or less' },
        { status: 400 }
      );
    }

    // Generate embedding from dream content
    let embedding: number[];
    try {
      embedding = await generateDreamEmbedding(title, content);
    } catch (error) {
      console.error('Embedding generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        {
          error: 'Failed to generate embedding',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Convert embedding array to pgvector format
    const embeddingString = `[${embedding.join(',')}]`;

    const tarotImageUrl = getRandomTarotCard(mood);
    console.log('Storing tarot image path:', tarotImageUrl);

    // Insert dream into database
    const result = await query<Dream>(
      `INSERT INTO dreams (user_id, title, content, mood, embedding, tarot_image_base64)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, content, mood, tarot_image_base64, created_at`,
      [session.user.id, title, content, mood || null, embeddingString, tarotImageUrl]
    );

    const dream = result.rows[0];

    // Trigger dream matching asynchronously (fire-and-forget)
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    if (host) {
      const matchUrl = `${protocol}://${host}/api/dreams/match?dreamId=${dream.id}`;
      fetch(matchUrl).catch(err => {
        console.error('Failed to trigger dream matching:', err);
      });
    }

    return NextResponse.json(
      {
        message: 'Dream submitted successfully',
        dream: {
          id: dream.id,
          user_id: dream.user_id,
          title: dream.title,
          content: dream.content,
          mood: dream.mood,
          tarot_image_base64: dream.tarot_image_base64,
          created_at: dream.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Dream submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

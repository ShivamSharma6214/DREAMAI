import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface DreamFragment {
  title: string;
  content: string;
  mood?: string;
}

/**
 * Generate a cohesive story from multiple dream fragments using Groq
 */
export async function generateMatchStory(
  dreams: DreamFragment[]
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  // Prepare dream fragments for the prompt
  const dreamsList = dreams
    .map((d, i) => `Dream ${i + 1}: "${d.title}" - ${d.content}`)
    .join('\n\n');

  const prompt = `These are dream fragments from different people. Find the connecting thread and write a cohesive dream story (150-200 words) weaving all fragments. Then explain the symbolic theme connecting them.

${dreamsList}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192',
    temperature: 0.7,
    max_tokens: 500,
  });

  const story = completion.choices[0]?.message?.content;

  if (!story) {
    throw new Error('Failed to generate story from Groq API');
  }

  return story.trim();
}

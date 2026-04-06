const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction';

export interface EmbeddingResponse {
  embedding: number[];
}

/**
 * Generate text embedding using Hugging Face Inference API
 * Includes retry logic for model loading (503 errors)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    console.error('HUGGINGFACE_API_KEY is not set in environment variables');
    throw new Error('HUGGINGFACE_API_KEY environment variable is not set');
  }

  console.log('Using Hugging Face API key:', apiKey.substring(0, 8) + '...');

  // Helper function to make the API call
  const makeRequest = async (): Promise<Response> => {
    return fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: {
          wait_for_model: true,
        },
      }),
    });
  };

  let response = await makeRequest();

  // Retry logic for 503 (model loading)
  if (response.status === 503) {
    console.log('Model is loading (503), waiting 10 seconds before retry...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Retrying embedding generation...');
    response = await makeRequest();
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Hugging Face API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('Embedding API response type:', typeof result, 'isArray:', Array.isArray(result));

  // The API returns the embedding directly as an array
  // or sometimes wrapped in an array depending on the model
  const embedding = Array.isArray(result[0]) ? result[0] : result;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    console.error('Invalid embedding response:', result);
    throw new Error('Invalid embedding response from Hugging Face API');
  }

  console.log('Generated embedding with', embedding.length, 'dimensions');
  return embedding;
}

/**
 * Generate embedding from dream content
 * Combines title and content for richer semantic representation
 */
export async function generateDreamEmbedding(
  title: string,
  content: string
): Promise<number[]> {
  const combinedText = `${title}\n\n${content}`;
  console.log('Generating embedding for text length:', combinedText.length, 'characters');
  return generateEmbedding(combinedText);
}

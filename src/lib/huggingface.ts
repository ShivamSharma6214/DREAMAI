const FLUX_API_URL = 'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0/pipeline/text-to-image';

/**
 * Generate a tarot card image based on dream content
 * Uses FLUX.1-schnell model from Hugging Face
 */
export async function generateTarotImage(
  title: string,
  content: string
): Promise<string | null> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    console.error('HUGGINGFACE_API_KEY environment variable is not set');
    return null;
  }

  try {
    // Create a concise summary for the prompt (limit to first 200 chars of content)
    const contentSummary = content.length > 200
      ? content.substring(0, 200) + '...'
      : content;

    // Construct the tarot card prompt
    const prompt = `A mystical tarot card illustration representing: ${title} - ${contentSummary}. Dark fantasy art style, ornate borders, ethereal lighting, symbolic imagery, vertical card format`;

    console.log('Generating tarot image with FLUX.1-schnell...');

    const response = await fetch(FLUX_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Hugging Face image generation error: ${response.status} - ${error}`);
      console.error('Request URL:', FLUX_API_URL);
      return null;
    }

    console.log('Image generated successfully, converting to base64...');

    // The response is a blob (image data)
    const imageBlob = await response.blob();

    // Convert blob to base64
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Return base64 string with data URI prefix
    return `data:${imageBlob.type};base64,${base64Image}`;
  } catch (error) {
    console.error('Tarot image generation error:', error);
    return null;
  }
}

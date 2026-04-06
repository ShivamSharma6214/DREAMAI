import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'HUGGINGFACE_API_KEY not found in environment',
      });
    }

    // Test the API with a simple request
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'test',
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    const responseText = await response.text();
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      parsedResponse = responseText;
    }

    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      httpStatus: response.status,
      statusText: response.statusText,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      response: parsedResponse,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

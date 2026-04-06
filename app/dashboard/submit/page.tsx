'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const moods = [
  'mysterious',
  'peaceful',
  'dark',
  'adventurous',
  'confusing',
];

export default function SubmitDreamPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tarotImage, setTarotImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dreams/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          mood: mood || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit dream');
      }

      setSuccess(true);
      setTarotImage(data.dream.tarot_image_base64);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-pulse">✨</div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Dream Submitted Successfully!
            </h1>
            <p className="text-gray-400">
              Your dream is being processed. Redirecting to dashboard...
            </p>
          </div>

          {tarotImage && (
            <div className="max-w-sm mx-auto">
              <h2 className="text-xl text-purple-300 mb-4">Your Tarot Card</h2>
              <div className="border-2 border-purple-600 rounded-lg overflow-hidden shadow-lg shadow-purple-500/50">
                <img
                  src={tarotImage}
                  alt="Generated Tarot Card"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Submit a Dream
          </h1>
          <p className="text-gray-400">
            Share your dream and receive a mystical tarot interpretation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border-2 border-purple-900 rounded-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-purple-300 font-semibold mb-2">
              Dream Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
              placeholder="e.g., Flying over the ocean"
              className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-800 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-purple-300 font-semibold mb-2">
              Dream Description *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              placeholder="Describe your dream in detail... What did you see, feel, and experience?"
              className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-800 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Mood */}
          <div className="mb-8">
            <label htmlFor="mood" className="block text-purple-300 font-semibold mb-2">
              Dream Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-800 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">Select a mood (optional)</option>
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting Dream...
              </span>
            ) : (
              '✨ Submit Dream'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

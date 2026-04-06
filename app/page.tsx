import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f2c] relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Stars effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="text-6xl mr-3">🌙</div>
              <h1 className="text-6xl md:text-7xl font-bold text-[#f59e0b] tracking-tight">
                DreamAI
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="h-px w-16 bg-linear-to-r from-transparent to-purple-500"></div>
              <div className="text-purple-400 text-sm tracking-widest uppercase">
                Connect the Collective Unconscious
              </div>
              <div className="h-px w-16 bg-linear-to-l from-transparent to-purple-500"></div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-delay-1">
            Your dreams are{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-amber-400">
              not alone
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-2">
            Discover the hidden connections between your dreams and those of others across the world.
            DreamAI uses advanced AI to weave your nocturnal visions into a collective tapestry,
            revealing the symbolic threads that bind us all.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto animate-fade-in-delay-3">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all hover:scale-105">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-400 text-sm">
                Advanced embeddings reveal deep semantic connections between dreams
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all hover:scale-105">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Mystical Tarot Cards</h3>
              <p className="text-gray-400 text-sm">
                Each dream receives a unique AI-generated tarot illustration
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all hover:scale-105">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Dream Matching</h3>
              <p className="text-gray-400 text-sm">
                Find dreamers worldwide who share your symbolic journey
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-4">
            <Link
              href="/auth/signup"
              className="group relative px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Start Dreaming</span>
                <span className="group-hover:translate-x-1 transition-transform">✨</span>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-300 font-semibold text-lg rounded-full hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200 transition-all hover:scale-105 w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="text-gray-500 text-sm mt-12 animate-fade-in-delay-5">
            Join thousands of dreamers exploring the collective unconscious
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0a0f2c] to-transparent pointer-events-none"></div>
    </div>
  );
}

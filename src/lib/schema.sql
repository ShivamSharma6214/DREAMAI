-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dreams table
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  tarot_image_base64 TEXT,
  embedding vector(384),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dream-Matches junction table
CREATE TABLE dream_matches (
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  PRIMARY KEY (dream_id, match_id)
);

-- Index for vector similarity search
CREATE INDEX ON dreams USING ivfflat (embedding vector_cosine_ops);

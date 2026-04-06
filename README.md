# DreamAI 🌙

> *Ever wake up at 3am from a dream so vivid you grabbed your phone to write 
> it down — but by morning all you had was a fragment? A door. A feeling. 
> A face you couldn't name. What if that fragment wasn't yours alone?*

DreamAI is a collective dream platform where strangers who share the same 
dream find each other. You log what you remember — however little — and the 
AI quietly searches through thousands of dream fragments to find the ones 
that match yours. When it does, it weaves them all into one complete story 
and sends it to everyone involved.

You were never dreaming alone.

---

## What It Does

- **Log dream fragments** with a title, description and mood tag
- **Get a tarot card** assigned to every dream you submit based on its mood
- **AI matching** uses semantic embeddings to find strangers who dreamed 
  the same thing — same symbols, same feelings, even if the words are different
- **Story generation** weaves all matched fragments into one cohesive 
  narrative using an LLM
- **Email notification** sends the complete story to every matched dreamer
- **Community feed** shows recent tarot cards from all users — no personal 
  info, just the dreams

---

## How It Works

1. You submit a dream fragment
2. The text is converted into a 384-dimension semantic embedding via 
   Hugging Face
3. pgvector compares your embedding against all other dreams in the DB 
   using cosine similarity
4. If similar dreams are found from other users, Groq's LLaMA3 weaves 
   them into one connected story
5. All matched dreamers receive an email with the complete story

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (SSR) |
| Database | PostgreSQL + pgvector |
| Embeddings | Hugging Face — all-MiniLM-L6-v2 |
| Story Generation | Groq — LLaMA3 8B |
| Auth | NextAuth.js (credentials) |
| Email | Nodemailer + Gmail SMTP |
| Styling | Tailwind CSS |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- Hugging Face API key
- Groq API key
- Gmail account with App Password enabled

### Setup
```bash
# Clone the repo
git clone https://github.com/yourusername/dreamai
cd dreamai

# Install dependencies
npm install

# Start the database
docker run -d \
  --name dreamai-db \
  -e POSTGRES_PASSWORD=dreamai123 \
  -e POSTGRES_DB=dreamai \
  -p 5432:5432 \
  ankane/pgvector

# Apply schema
docker exec -i dreamai-db psql -U postgres -d dreamai < src/lib/schema.sql

# Create .env.local
cp .env.example .env.local
# Fill in your API keys

# Run the app
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://postgres:dreamai123@localhost:5432/dreamai
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
HUGGINGFACE_API_KEY=hf_your_key
GROQ_API_KEY=gsk_your_key
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```


---

## Roadmap

- [ ] Real-time match notifications
- [ ] Dream visualisation with AI generated imagery
- [ ] Mobile app
- [ ] Public dream archive with anonymised stories
- [ ] Multi-language support

---

*Built as a portfolio project. Became something I actually want to use.*

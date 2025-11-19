# AI Customer Support Chatbot

A full-stack AI chatbot application with RAG (Retrieval-Augmented Generation) capabilities, built with React + RSPack frontend and FastAPI backend.

## Features

- **Document Upload**: Admins can upload PDF/text documents to train the bot
- **RAG-based Chat**: Users can ask questions and get answers based on uploaded documents
- **WebSocket Streaming**: Real-time streaming responses for better UX
- **Role-based Authentication**: Admin and User roles with different permissions
- **Vector Database**: PostgreSQL with pgvector for semantic search

## Architecture

### Frontend
- React + RSPack + TypeScript
- Feature-based component structure
- WebSocket client for streaming
- Role-based route protection

### Backend
- FastAPI (Python)
- PostgreSQL with pgvector extension
- Langchain for text processing
- OpenRouter API for LLM and embeddings

## Why Vector DB (pgvector)?

Vector databases store document embeddings (numerical representations) that enable semantic search:

1. **Question → Embedding**: User question is converted to an embedding vector
2. **Similarity Search**: Vector DB finds similar document chunks using cosine similarity
3. **Context Retrieval**: Most relevant chunks are retrieved for RAG context
4. **Answer Generation**: LLM generates answer using retrieved context

**What's stored in vector DB:**
- Document chunks (text segments from PDFs)
- Embeddings (1536-dimensional vectors for OpenAI ada-002)
- Metadata (document ID, chunk index, upload date, admin ID)

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- OpenRouter API key (free tier available)

### Backend Setup

1. **Start PostgreSQL with pgvector:**
```bash
docker-compose up -d
```

2. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cd backend
cp .env.example .env
```

**IMPORTANT: Add your API key to the `.env` file**

Open `backend/.env` and replace the placeholder with your actual API key:

**Option 1: Using OpenAI API directly**
```bash
# Replace this line in .env:
OPENROUTER_API_KEY=sk-proj-YOUR-OPENAI-KEY-HERE

# Also change the base URL to use OpenAI directly:
OPENROUTER_BASE_URL=https://api.openai.com/v1
```

**Option 2: Using OpenRouter (recommended for free tier)**
```bash
# Get a free key from: https://openrouter.ai/
OPENROUTER_API_KEY=sk-or-v1-YOUR-OPENROUTER-KEY-HERE
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

4. **Initialize database:**
```bash
python init_db.py
```

5. **Run backend:**
```bash
python run.py
# or
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account (first user can be admin)
2. **Upload Documents** (Admin only): Go to "Manage Documents" and upload PDF/TXT files
3. **Chat**: Ask questions related to uploaded documents
4. **Out of Context**: If question is not related to documents, bot will respond with "Sorry, I don't understand"

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Documents (Admin only)
- `POST /documents/upload` - Upload PDF/text document
- `GET /documents/list` - List all documents
- `DELETE /documents/{id}` - Delete document

### Chat
- `WS /ws/chat?token={jwt_token}` - WebSocket endpoint for streaming chat

## Project Structure

```
ChatBot/
├── frontend/          # React + RSPack frontend
│   ├── src/
│   │   ├── features/  # Feature-based components
│   │   ├── common/    # Reusable components
│   │   ├── hooks/     # Custom React hooks
│   │   └── services/  # API and WebSocket services
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── models/    # Database models
│   │   ├── routers/   # API routes
│   │   ├── services/  # Business logic
│   │   └── utils/     # Utilities
└── docker-compose.yml # PostgreSQL + pgvector setup
```

## Environment Variables

### Backend (.env)

**For OpenAI API (direct):**
```
DATABASE_URL=postgresql://chatbot_user:chatbot_password@localhost:5432/chatbot_db
SECRET_KEY=your-secret-key-here
OPENROUTER_API_KEY=sk-proj-YOUR-OPENAI-KEY-HERE
OPENROUTER_BASE_URL=https://api.openai.com/v1
EMBEDDING_MODEL=text-embedding-ada-002
LLM_MODEL=gpt-3.5-turbo
SIMILARITY_THRESHOLD=0.7
```

**For OpenRouter API (with free tier):**
```
DATABASE_URL=postgresql://chatbot_user:chatbot_password@localhost:5432/chatbot_db
SECRET_KEY=your-secret-key-here
OPENROUTER_API_KEY=sk-or-v1-YOUR-OPENROUTER-KEY-HERE
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
EMBEDDING_MODEL=openai/text-embedding-ada-002
LLM_MODEL=openai/gpt-3.5-turbo
SIMILARITY_THRESHOLD=0.7
```

**Note:** When using OpenRouter, keep the `openai/` prefix in model names. When using OpenAI directly, remove the prefix.

## Notes

- First registered user should be created as admin manually or via database
- Documents are chunked into 500-character segments with 50-character overlap
- Similarity threshold of 0.7 filters out irrelevant chunks
- WebSocket streaming provides real-time response updates


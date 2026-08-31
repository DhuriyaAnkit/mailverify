# MailVerify

Check if an email address exists across 100+ online services using the [holehe](https://github.com/megadose/holehe) tool, via a clean web interface.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Supabase Auth
- **Backend**: FastAPI + holehe
- **Database/Auth**: Supabase

## Project Structure

```
├── frontend/     # React app (Vite + TypeScript)
│   └── src/
│       ├── components/   # UI components
│       └── lib/          # Supabase client
├── backend/      # FastAPI server
│   └── app/
│       ├── main.py       # API entrypoint
│       ├── holehe_client.py
│       └── routers/
└── requirements.txt
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and the backend on http://localhost:8000.

## How It Works

1. Enter an email address on the web UI
2. Backend checks the email against 100+ services via holehe
3. Results show which services have an account registered with that email
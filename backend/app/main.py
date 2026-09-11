import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routers import check

app = FastAPI(title="MailVerify API", version="1.0.0")

# Configure CORS for local development and production
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]

if raw_origins.strip() == "*":
    allow_origins = ["*"]
    allow_credentials = False
elif raw_origins.strip():
    extra_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    allow_origins = list(set(default_origins + extra_origins))
    allow_credentials = True
else:
    allow_origins = default_origins
    allow_credentials = True

# Allows Vercel preview & production deployments by default, customizable via ALLOWED_ORIGIN_REGEX
allow_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", r"https://.*\.vercel\.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex if allow_origins != ["*"] else None,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(check.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
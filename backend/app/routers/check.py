from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from ..holehe_client import check_email

router = APIRouter()


class CheckRequest(BaseModel):
    email: str
    timeout: int = 10


class CheckResponse(BaseModel):
    email: str
    total_sites: int
    registered_sites: int
    results: list[dict]


@router.post("/check-email", response_model=CheckResponse)
async def check_email_endpoint(req: CheckRequest):
    try:
        results = await check_email(req.email, timeout=req.timeout)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    registered = sum(1 for r in results if r.get("exists"))

    return CheckResponse(
        email=req.email,
        total_sites=len(results),
        registered_sites=registered,
        results=results,
    )


@router.get("/check-email-status/{email}")
async def check_email_status(email: str):
    return {"email": email, "status": "queue", "message": "Use POST /api/check-email to start a check"}
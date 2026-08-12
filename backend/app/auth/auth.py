import os
import requests

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

security = HTTPBearer()

# Reused across requests so calls to Supabase's Auth server can reuse an
# already-established TCP + TLS connection (HTTP keep-alive) instead of
# renegotiating one on every single authenticated request. This changes
# nothing about what is verified or how -- same remote check, same
# response handling -- it just avoids paying handshake cost every time.
_session = requests.Session()
_adapter = requests.adapters.HTTPAdapter(pool_connections=10, pool_maxsize=10)
_session.mount("https://", _adapter)
_session.mount("http://", _adapter)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    FastAPI dependency that validates a Supabase access token by calling
    Supabase Auth's /auth/v1/user endpoint (no local JWT decoding).

    Usage in a route (not applied anywhere yet):
        @router.get("/some-protected-route")
        def handler(current_user = Depends(get_current_user)):
            ...
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase configuration is missing."
        )

    access_token = credentials.credentials

    try:
        response = _session.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "apikey": SUPABASE_ANON_KEY,
            },
            timeout=10,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Unable to verify authentication."
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )

    user = response.json()

    if not user or not user.get("id"):
        raise HTTPException(
            status_code=401,
            detail="Invalid authenticated user."
        )

    return user
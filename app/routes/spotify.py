import os
import requests
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REFRESH_TOKEN = os.getenv("SPOTIFY_REFRESH_TOKEN")

def get_access_token():
    """Exchange refresh token for new access token"""
    url = "https://accounts.spotify.com/api/token"
    response = requests.post(
        url,
        data={
            "grant_type": "refresh_token",
            "refresh_token": SPOTIFY_REFRESH_TOKEN,
            "client_id": SPOTIFY_CLIENT_ID,
            "client_secret": SPOTIFY_CLIENT_SECRET,
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]

@router.get("/now-playing")
def now_playing():
    """Return currently playing track"""
    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        resp = requests.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            headers=headers,
        )

        if resp.status_code == 204 or resp.status_code >= 400:
            return JSONResponse({"is_playing": False})

        data = resp.json()
        item = data["item"]
        return {
            "is_playing": data["is_playing"],
            "song": item["name"],
            "artist": ", ".join([a["name"] for a in item["artists"]]),
            "album": item["album"]["name"],
            "cover": item["album"]["images"][0]["url"],
            "url": item["external_urls"]["spotify"],
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

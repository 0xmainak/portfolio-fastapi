from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from .routes import router, github_router, spotify_router, contributions_router
from dotenv import load_dotenv
import os

load_dotenv()

def init_app():
    app = FastAPI(
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("FRONTEND_URL"), "localhost"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(router=router)
    app.include_router(router=spotify_router, prefix="/spotify")
    app.include_router(router=contributions_router, prefix="/github")
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    return app

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from .routes import router, github_router, spotify_router, contributions_router

def init_app():
    app = FastAPI()
    app.include_router(router=router)
    app.include_router(router=github_router, prefix="/github")
    app.include_router(router=spotify_router, prefix="/spotify")
    app.include_router(router=contributions_router, prefix="/github")
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    return app

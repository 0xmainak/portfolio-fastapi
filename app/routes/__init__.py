from .root import router
from .github import router as github_router
from .spotify import router as spotify_router
from .github import router as contributions_router

__all__ = ["router", "github_router", "spotify_router", "contributions_router"]
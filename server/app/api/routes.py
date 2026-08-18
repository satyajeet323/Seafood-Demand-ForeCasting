# This module is kept for backwards compatibility.
# The router has moved to app/api/routes/forecast.py
from app.api.routes.forecast import router  # noqa: F401

__all__ = ["router"]

#! /usr/bin/env python3
import os
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from uvicorn import Config, Server

PORT = int(os.environ.get("PORT", "80"))
STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(title="__TITLE__")


@app.get("/register_service", include_in_schema=False)
def register_service() -> Dict[str, Any]:
    """Metadata consumed by BlueOS to add this extension to the sidebar."""
    return {
        "name": "__TITLE__",
        "description": "A BlueOS extension.",
        "icon": "mdi-puzzle-outline",
        "company": "Blue Robotics",
        "version": "0.1.0",
        "new_page": False,
        "api": "/docs",
        "works_in_relative_paths": True,
    }


@app.get("/v1.0/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")


def main() -> None:
    Server(Config(app=app, host="0.0.0.0", port=PORT, log_config=None)).run()


if __name__ == "__main__":
    main()

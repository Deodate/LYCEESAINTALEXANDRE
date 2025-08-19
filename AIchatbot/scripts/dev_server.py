#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib
import os
import socket
import sys
from contextlib import closing
from typing import List, Optional, Tuple


def is_port_free(host: str, port: int) -> bool:
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, port))
            return True
        except OSError:
            return False


def pick_port(host: str, preferred: List[int]) -> int:
    # 1) Respect PORT env if available and free
    env_port = os.getenv("PORT")
    if env_port:
        try:
            p = int(env_port)
            if is_port_free(host, p):
                return p
        except ValueError:
            pass

    # 2) Check preferred list
    for p in preferred:
        if is_port_free(host, p):
            return p

    # 3) Ask OS for an ephemeral free port
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind((host, 0))
        return s.getsockname()[1]


def split_module_target(target: str) -> Tuple[str, str]:
    # Format: module:attr (e.g., app:app)
    if ":" not in target:
        raise SystemExit("--app must be in form 'module:attr', e.g., app:app")
    mod, attr = target.split(":", 1)
    return mod, attr


def get_app(target: str):
    mod_name, attr_name = split_module_target(target)
    module = importlib.import_module(mod_name)
    return getattr(module, attr_name)


def add_fastapi_cors(app, origins: List[str]):
    try:
        from fastapi.middleware.cors import CORSMiddleware  # type: ignore
    except Exception:
        print("[warn] FastAPI CORS middleware not available; skipping.")
        return
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def add_flask_cors(app, origins: List[str]):
    try:
        from flask_cors import CORS  # type: ignore
        CORS(app, resources={r"*": {"origins": origins}})
    except Exception:
        print("[warn] flask-cors not installed; CORS disabled for Flask.")


def run():
    parser = argparse.ArgumentParser(description="Dev server with auto port selection and CORS")
    parser.add_argument("--app", default="app:app", help="Target WSGI/ASGI app, e.g., app:app")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--preferred-ports", default="9090,8000,8080",
                        help="Comma-separated preferred ports in order")
    parser.add_argument("--origins", default="http://localhost:3000,http://127.0.0.1:3000",
                        help="Comma-separated CORS origins")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload where supported")
    args = parser.parse_args()

    origins = [o.strip() for o in args.origins.split(",") if o.strip()]
    preferred = [int(p) for p in args.preferred_ports.split(",") if p.strip()]

    app_obj = get_app(args.app)
    port = pick_port(args.host, preferred)

    # Try to detect framework
    framework = None
    try:
        from fastapi import FastAPI  # type: ignore
        if isinstance(app_obj, FastAPI):
            framework = "fastapi"
    except Exception:
        pass
    if framework is None:
        try:
            from flask import Flask  # type: ignore
            if isinstance(app_obj, Flask):
                framework = "flask"
        except Exception:
            pass

    if framework == "fastapi":
        add_fastapi_cors(app_obj, origins)
        try:
            import uvicorn  # type: ignore
        except Exception:
            raise SystemExit("uvicorn is required to run FastAPI apps. Please install it.")
        print(f"[info] Starting FastAPI on http://localhost:{port}")
        uvicorn.run(app_obj, host=args.host, port=port, reload=args.reload)
        return

    if framework == "flask":
        add_flask_cors(app_obj, origins)
        print(f"[info] Starting Flask on http://localhost:{port}")
        app_obj.run(host=args.host, port=port, debug=args.reload)
        return

    raise SystemExit("Could not detect FastAPI or Flask app. Ensure --app points to app instance.")


if __name__ == "__main__":
    run()















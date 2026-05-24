#!/usr/bin/env python3
"""Utility to start Ultra‑Tax‑Calculator‑Advance locally.

Usage:
    python3 run_app.py   # installs deps (if needed) and starts Vite dev server

The script works on macOS (and other platforms with Node & npm installed).
It:
  1. Checks if the `node_modules` folder exists; if not, runs `npm install`.
  2. Launches `npm run dev` (Vite dev server) as a subprocess.
  3. Prints the URL to open (http://localhost:5173) and forwards the server's output.
  4. Handles Ctrl‑C gracefully, terminating the server.
"""
import subprocess
import sys
from pathlib import Path

# Directory containing this script – also the project root
PROJECT_ROOT = Path(__file__).resolve().parent


def run_cmd(command: str, cwd: Path) -> None:
    """Run a shell command synchronously, aborting on error."""
    result = subprocess.run(command, cwd=cwd, shell=True)
    if result.returncode != 0:
        sys.exit(result.returncode)


def main() -> None:
    # Step 1: install dependencies if missing
    if not (PROJECT_ROOT / "node_modules").exists():
        print("⚙️  Installing npm dependencies…")
        run_cmd("npm install", PROJECT_ROOT)
    else:
        print("✅  node_modules already present – skipping npm install")

    # Step 2: start the Vite dev server
    print("🚀  Starting Vite dev server (http://localhost:5173)...")
    # Use Popen so we can forward its stdout/stderr live
    proc = subprocess.Popen("npm run dev", cwd=PROJECT_ROOT, shell=True)
    try:
        proc.wait()  # block until the dev server exits
    except KeyboardInterrupt:
        print("\n✋  Caught interrupt – stopping dev server…")
        proc.terminate()
        proc.wait()
        print("🛑  Server stopped.")


if __name__ == "__main__":
    main()

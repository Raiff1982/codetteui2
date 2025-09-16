#!/usr/bin/env python3
"""
Production-ready backend starter
"""

import os
import sys
import signal
import uvicorn
from dotenv import load_dotenv
from pathlib import Path

# Add parent directory to Python path for imports
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))

# Load environment variables
load_dotenv()

# Signal handlers
def handle_exit(signum, frame):
    print("\nReceived signal to terminate. Shutting down gracefully...")
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

if __name__ == "__main__":
    # Production settings from environment
    is_production = os.getenv('ENVIRONMENT', 'development') == 'production'
    host = os.getenv('API_HOST', '0.0.0.0')
    port = int(os.getenv('API_PORT', '8000'))
    
    print("🚀 Starting Codette AI Backend...")
    print(f"📚 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"🔒 Security: {'Production' if is_production else 'Development'}")
    print("="*60)
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=not is_production,  # Only reload in development
        workers=1 if not is_production else 4,  # Multiple workers in production
        log_level="info",
        access_log=True
    )
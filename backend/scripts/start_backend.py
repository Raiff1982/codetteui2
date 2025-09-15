#!/usr/bin/env python3
"""
Backend Startup Script
Automated backend initialization and health checking
"""

import os
import sys
import subprocess
import time
import requests
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BackendStarter:
    """Automated backend startup and health checking"""
    
    def __init__(self):
        self.backend_dir = Path(__file__).parent.parent
        self.requirements_file = self.backend_dir / "requirements.txt"
        self.main_file = self.backend_dir / "main.py"
        self.health_url = "http://localhost:8000/api/health"
        
    def check_python_version(self) -> bool:
        """Check if Python version is compatible"""
        version = sys.version_info
        if version.major == 3 and version.minor >= 8:
            logger.info(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
            return True
        else:
            logger.error(f"❌ Python {version.major}.{version.minor}.{version.micro} is not compatible. Need Python 3.8+")
            return False
    
    def check_requirements_file(self) -> bool:
        """Check if requirements.txt exists"""
        if self.requirements_file.exists():
            logger.info("✅ requirements.txt found")
            return True
        else:
            logger.error("❌ requirements.txt not found")
            return False
    
    def install_dependencies(self) -> bool:
        """Install Python dependencies"""
        try:
            logger.info("📦 Installing Python dependencies...")
            result = subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(self.requirements_file)
            ], capture_output=True, text=True, cwd=self.backend_dir)
            
            if result.returncode == 0:
                logger.info("✅ Dependencies installed successfully")
                return True
            else:
                logger.error(f"❌ Dependency installation failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Dependency installation error: {e}")
            return False
    
    def start_backend_server(self) -> subprocess.Popen:
        """Start the FastAPI backend server"""
        try:
            logger.info("🚀 Starting FastAPI backend server...")
            
            # Start the server as a subprocess
            process = subprocess.Popen([
                sys.executable, "start.py"
            ], cwd=self.backend_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            logger.info(f"🔄 Backend server started with PID: {process.pid}")
            return process
            
        except Exception as e:
            logger.error(f"❌ Failed to start backend server: {e}")
            raise
    
    def wait_for_health_check(self, timeout: int = 60) -> bool:
        """Wait for backend to become healthy"""
        logger.info("🏥 Waiting for backend health check...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = requests.get(self.health_url, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "healthy":
                        logger.info("✅ Backend is healthy and ready!")
                        return True
            except requests.exceptions.RequestException:
                pass
            
            logger.info("⏳ Waiting for backend to start...")
            time.sleep(2)
        
        logger.error("❌ Backend health check timeout")
        return False
    
    def run_full_startup(self) -> bool:
        """Run complete backend startup process"""
        logger.info("🚀 Starting Codette Backend Initialization...")
        logger.info("=" * 60)
        
        # Check prerequisites
        if not self.check_python_version():
            return False
        
        if not self.check_requirements_file():
            return False
        
        # Install dependencies
        if not self.install_dependencies():
            logger.error("❌ Failed to install dependencies")
            return False
        
        # Start server
        try:
            process = self.start_backend_server()
            
            # Wait for health check
            if self.wait_for_health_check():
                logger.info("🎉 Backend startup completed successfully!")
                logger.info("🌐 Backend API: http://localhost:8000")
                logger.info("📚 API Docs: http://localhost:8000/docs")
                logger.info("🏥 Health Check: http://localhost:8000/api/health")
                logger.info("=" * 60)
                return True
            else:
                logger.error("❌ Backend failed to become healthy")
                process.terminate()
                return False
                
        except Exception as e:
            logger.error(f"❌ Backend startup failed: {e}")
            return False

def main():
    """Main startup function"""
    starter = BackendStarter()
    success = starter.run_full_startup()
    
    if success:
        logger.info("✅ Codette Backend is ready for AI-powered development!")
        return 0
    else:
        logger.error("❌ Backend startup failed. Please check the logs and try manual setup.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
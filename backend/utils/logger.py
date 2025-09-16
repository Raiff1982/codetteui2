"""
Logger Utility for Codette Backend
Comprehensive logging setup with structured output
"""

import logging
import sys
from datetime import datetime
from typing import Optional

def setup_logger(name: str, level: str = "INFO") -> logging.Logger:
    """Setup structured logger for Codette backend"""
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Create formatter
    formatter = logging.Formatter(
        fmt='%(asctime)s | %(name)s | %(levelname)s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler for production
    try:
        file_handler = logging.FileHandler('backend/logs/codette.log')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception:
        # If logs directory doesn't exist, continue without file logging
        pass
    
    return logger
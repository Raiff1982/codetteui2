"""
Logging Configuration for Codette Backend
Structured logging with correlation IDs and proper formatting
"""

import logging
import logging.config
import sys
import os
from datetime import datetime
from typing import Dict, Any
import json

class CorrelationFilter(logging.Filter):
    """Add correlation ID to log records"""
    
    def filter(self, record):
        # Add correlation ID if not present
        if not hasattr(record, 'correlation_id'):
            record.correlation_id = getattr(record, 'decision_id', 'unknown')
        return True

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'correlation_id': getattr(record, 'correlation_id', 'unknown'),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry)

def setup_logging(config: Dict[str, Any] = None) -> None:
    """Setup comprehensive logging configuration"""
    
    if config is None:
        config = {
            'version': 1,
            'disable_existing_loggers': False,
            'formatters': {
                'standard': {
                    'format': '%(asctime)s | %(name)s | %(levelname)s | [%(correlation_id)s] | %(message)s',
                    'datefmt': '%Y-%m-%d %H:%M:%S'
                },
                'json': {
                    '()': JSONFormatter
                }
            },
            'filters': {
                'correlation': {
                    '()': CorrelationFilter
                }
            },
            'handlers': {
                'console': {
                    'class': 'logging.StreamHandler',
                    'level': 'INFO',
                    'formatter': 'standard',
                    'filters': ['correlation'],
                    'stream': sys.stdout
                },
                'file': {
                    'class': 'logging.handlers.RotatingFileHandler',
                    'level': 'DEBUG',
                    'formatter': 'json',
                    'filters': ['correlation'],
                    'filename': 'backend/logs/codette.log',
                    'maxBytes': 10485760,  # 10MB
                    'backupCount': 5
                }
            },
            'loggers': {
                'codette': {
                    'level': 'DEBUG',
                    'handlers': ['console', 'file'],
                    'propagate': False
                },
                'uvicorn': {
                    'level': 'INFO',
                    'handlers': ['console'],
                    'propagate': False
                }
            },
            'root': {
                'level': 'INFO',
                'handlers': ['console']
            }
        }
    
    # Ensure log directory exists
    log_dir = os.path.dirname(config['handlers']['file']['filename'])
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)
    
    logging.config.dictConfig(config)
    
    # Set correlation ID for main logger
    logger = logging.getLogger('codette')
    logger.info("📝 Logging system initialized with correlation tracking")

def get_logger(name: str, correlation_id: str = None) -> logging.Logger:
    """Get logger with correlation ID"""
    logger = logging.getLogger(f'codette.{name}')
    
    if correlation_id:
        # Create adapter that adds correlation ID
        class CorrelationAdapter(logging.LoggerAdapter):
            def process(self, msg, kwargs):
                return f'[{correlation_id}] {msg}', kwargs
        
        return CorrelationAdapter(logger, {})
    
    return logger
"""
Comprehensive test script to verify all claimed features
"""
import os
import json
import asyncio
import aiohttp
import time
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_code_analysis():
    """Test code analysis features"""
    logger.info("\n=== Testing Code Analysis ===")
    
    async with aiohttp.ClientSession() as session:
        # Test Python analysis
        with open(os.path.join(os.path.dirname(__file__), 'test_analysis.py'), 'r') as f:
            python_code = f.read()
        
        async with session.post(
            'http://localhost:8000/api/analysis/code',
            json={'code': python_code, 'language': 'python'}
        ) as response:
            status = response.status
            result = await response.json()
            logger.info(f"\nPython Analysis Response (Status {status}):")
            logger.info(json.dumps(result, indent=2))
            
        # Test JavaScript analysis
        with open(os.path.join(os.path.dirname(__file__), 'test_analysis.js'), 'r') as f:
            js_code = f.read()
        
        async with session.post(
            'http://localhost:8000/api/analysis/code',
            json={'code': js_code, 'language': 'javascript'}
        ) as response:
            status = response.status
            result = await response.json()
            logger.info(f"\nJavaScript Analysis Response (Status {status}):")
            logger.info(json.dumps(result, indent=2))

async def test_security_features():
    """Test security features"""
    logger.info("\n=== Testing Security Features ===")
    
    async with aiohttp.ClientSession() as session:
        # Test rate limiting
        logger.info("\nTesting Rate Limiting...")
        start_time = time.time()
        requests = []
        for _ in range(70):  # Should hit rate limit (60 per minute)
            requests.append(session.get('http://localhost:8000/api/health'))
        
        responses = await asyncio.gather(*requests, return_exceptions=True)
        rate_limited = sum(1 for r in responses if isinstance(r, aiohttp.ClientResponse) and r.status == 429)
        print(f"- Rate limiting: {'✓' if rate_limited > 0 else '✗'} ({rate_limited} requests were rate limited)")

        # Test input validation
        print("\nTesting Input Validation...")
        async with session.post(
            'http://localhost:8000/api/analysis/code',
            json={'code': 'x' * 100000, 'language': 'python'}  # Too long
        ) as response:
            print(f"- Input length validation: {'✓' if response.status == 400 else '✗'}")

async def test_api_integration():
    """Test API integration"""
    print("\n=== Testing API Integration ===")
    
    async with aiohttp.ClientSession() as session:
        async with session.get('http://localhost:8000/api/health') as response:
            result = await response.json()
            print(f"- Health check: {'✓' if response.status == 200 else '✗'}")
            print(f"- Status: {result.get('status')}")

async def test_data_protection():
    """Test data protection features"""
    print("\n=== Testing Data Protection ===")
    
    test_data = "sensitive test data"
    async with aiohttp.ClientSession() as session:
        # Test encryption
        async with session.post(
            'http://localhost:8000/api/security/encrypt',
            json={'data': test_data}
        ) as response:
            if response.status == 200:
                encrypted = await response.json()
                print("- Encryption: ✓")
                
                # Test decryption
                async with session.post(
                    'http://localhost:8000/api/security/decrypt',
                    json={'data': encrypted['encrypted']}
                ) as dec_response:
                    if dec_response.status == 200:
                        decrypted = await dec_response.json()
                        print(f"- Decryption: {'✓' if decrypted['data'] == test_data else '✗'}")

async def main():
    """Run all tests"""
    print("Starting comprehensive feature verification...")
    
    await test_code_analysis()
    await test_security_features()
    await test_api_integration()
    await test_data_protection()

if __name__ == "__main__":
    asyncio.run(main())
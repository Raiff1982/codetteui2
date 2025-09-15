"""
Pytest configuration and fixtures for Codette backend tests
"""

import pytest
import asyncio
import tempfile
import os
from typing import Generator

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def temp_db():
    """Create a temporary database for testing"""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name
    
    yield db_path
    
    # Cleanup
    try:
        os.unlink(db_path)
    except OSError:
        pass

@pytest.fixture
def sample_code():
    """Sample code for testing"""
    return """
function calculateSum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Invalid input: both arguments must be numbers');
    }
    return a + b;
}

class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = calculateSum(a, b);
        this.history.push({ operation: 'add', a, b, result });
        return result;
    }
}
"""

@pytest.fixture
def sample_python_code():
    """Sample Python code for testing"""
    return """
def calculate_fibonacci(n):
    \"\"\"Calculate Fibonacci number using dynamic programming\"\"\"
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

class MathUtils:
    @staticmethod
    def is_prime(num):
        if num < 2:
            return False
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                return False
        return True
"""
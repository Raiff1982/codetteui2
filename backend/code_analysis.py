"""
Code analysis module providing basic static analysis for Python and JavaScript code.
"""
import os
import tempfile
import subprocess
from typing import Dict, List, Optional
import pylint.lint
from pylint.reporters import JSONReporter
import bandit.core.manager
from bandit.core import config
import esprima
from pydantic import BaseModel

class CodeAnalysisResult(BaseModel):
    """Results from code analysis"""
    linting_issues: List[Dict]
    security_issues: List[Dict]
    metrics: Dict
    suggestions: List[str]

def analyze_python_code(code: str) -> CodeAnalysisResult:
    """Analyze Python code using Pylint and Bandit"""
    # Create temporary file for analysis
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        # Pylint analysis
        pylint_output = []
        reporter = JSONReporter()
        pylint.lint.Run([tmp_path], reporter=reporter, exit=False)
        linting_issues = [
            {
                'message': msg.msg or 'Unknown issue',
                'line': msg.line,
                'column': msg.column,
                'type': msg.symbol,
                'module': msg.module
            }
            for msg in reporter.messages
        ]

        # Bandit security analysis
        b_conf = config.BanditConfig()
        b_mgr = bandit.core.manager.BanditManager(b_conf, 'file')
        b_mgr.discover_files([tmp_path])
        b_mgr.run_tests()
        security_issues = []
        for issue in b_mgr.get_issue_list():
            issue_dict = issue.__dict__
            security_issues.append({
                'severity': str(issue_dict.get('severity', 'UNKNOWN')),
                'confidence': str(issue_dict.get('confidence', 'UNKNOWN')),
                'description': str(issue_dict.get('text', 'Unknown security issue')),
                'line': issue_dict.get('lineno', 0),
                'test_id': issue_dict.get('test_id', 'UNKNOWN')
            })

        # Basic metrics
        metrics = {
            'total_issues': len(linting_issues),
            'security_issues': len(security_issues),
            'maintainability_index': calculate_maintainability(code)
        }

        # Generate suggestions
        suggestions = generate_suggestions(linting_issues, security_issues)

        return CodeAnalysisResult(
            linting_issues=linting_issues,
            security_issues=security_issues,
            metrics=metrics,
            suggestions=suggestions
        )

    finally:
        os.unlink(tmp_path)

def analyze_javascript_code(code: str) -> CodeAnalysisResult:
    """Analyze JavaScript code using Esprima and basic metrics"""
    try:
        # Parse JavaScript code
        ast = esprima.parseScript(code)
        
        # Basic static analysis
        linting_issues = []
        metrics = {
            'statements': count_statements(ast),
            'complexity': calculate_complexity(ast)
        }

        # Security checks
        security_issues = check_js_security(ast)

        # Generate suggestions
        suggestions = generate_js_suggestions(metrics, security_issues)

        return CodeAnalysisResult(
            linting_issues=linting_issues,
            security_issues=security_issues,
            metrics=metrics,
            suggestions=suggestions
        )
    except Exception as e:
        return CodeAnalysisResult(
            linting_issues=[{'message': str(e)}],
            security_issues=[],
            metrics={'error': 'Failed to parse JavaScript'},
            suggestions=['Fix syntax errors in the code']
        )

def calculate_maintainability(code: str) -> float:
    """Calculate a basic maintainability index"""
    lines = code.split('\n')
    loc = len([l for l in lines if l.strip()])
    comments = len([l for l in lines if l.strip().startswith('#')])
    return min(100, max(0, 100 - (loc / 10) + (comments / loc * 20) if loc > 0 else 0))

def count_statements(ast) -> int:
    """Count the number of statements in JavaScript AST"""
    return len(ast.body)

def calculate_complexity(ast) -> int:
    """Calculate cyclomatic complexity from JavaScript AST"""
    complexity = 1
    # Add basic complexity counting logic here
    return complexity

def check_js_security(ast) -> List[Dict]:
    """Basic security checks for JavaScript code"""
    issues = []
    # Add basic security checks here
    return issues

def generate_suggestions(linting_issues: List[Dict], security_issues: List[Dict]) -> List[str]:
    """Generate actionable suggestions from analysis results"""
    suggestions = []
    
    if linting_issues:
        suggestions.append("Fix linting issues to improve code quality")
    if security_issues:
        suggestions.append("Address security concerns to improve code safety")
    
    return suggestions

def generate_js_suggestions(metrics: Dict, security_issues: List[Dict]) -> List[str]:
    """Generate suggestions for JavaScript code"""
    suggestions = []
    
    if metrics.get('complexity', 0) > 10:
        suggestions.append("Consider breaking down complex functions")
    if security_issues:
        suggestions.append("Review code for potential security issues")
    
    return suggestions
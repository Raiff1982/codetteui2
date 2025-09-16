"""
API endpoints for code analysis
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..code_analysis import analyze_python_code, analyze_javascript_code, CodeAnalysisResult

router = APIRouter()

class AnalysisRequest(BaseModel):
    code: str
    language: str

@router.post("/api/analysis/code", response_model=CodeAnalysisResult)
async def analyze_code(request: AnalysisRequest) -> CodeAnalysisResult:
    """
    Analyze code for quality and security issues.
    
    Currently supports:
    - Python: Using Pylint and Bandit
    - JavaScript: Using Esprima
    """
    try:
        if request.language.lower() == 'python':
            return analyze_python_code(request.code)
        elif request.language.lower() in ['javascript', 'js']:
            return analyze_javascript_code(request.code)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported language: {request.language}. Currently supporting Python and JavaScript."
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
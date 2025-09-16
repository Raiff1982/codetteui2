"""
Security endpoints for Codette backend
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..security_utils import SecurityUtils

router = APIRouter()
security = SecurityUtils("your-secret-key")  # In production, use environment variable

class EncryptRequest(BaseModel):
    data: str = Field(..., min_length=1, max_length=10000)

class EncryptResponse(BaseModel):
    encrypted: str

class DecryptRequest(BaseModel):
    data: str

class DecryptResponse(BaseModel):
    data: str

@router.post("/api/security/encrypt", response_model=EncryptResponse)
async def encrypt_data(request: EncryptRequest) -> EncryptResponse:
    """Encrypt provided data"""
    try:
        encrypted = security.encrypt_data(request.data)
        return EncryptResponse(encrypted=encrypted.decode())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

@router.post("/api/security/decrypt", response_model=DecryptResponse)
async def decrypt_data(request: DecryptRequest) -> DecryptResponse:
    """Decrypt provided data"""
    try:
        decrypted = security.decrypt_data(request.data.encode())
        return DecryptResponse(data=decrypted.decode())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")
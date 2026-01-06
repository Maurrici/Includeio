"""Routes for application types"""
from fastapi import APIRouter, HTTPException
from typing import List
from database import db
from models import ApplicationType

router = APIRouter(prefix="/application-types", tags=["application-types"])


@router.get("/", response_model=List[ApplicationType])
async def get_application_types():
    """Get all available application types"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, created_at
            FROM application_types
            ORDER BY name
        """)
        types = cursor.fetchall()
        return [dict(t) for t in types]


@router.get("/{type_id}", response_model=ApplicationType)
async def get_application_type(type_id: int):
    """Get a specific application type by ID"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, created_at
            FROM application_types
            WHERE id = %s
        """, (type_id,))
        app_type = cursor.fetchone()
        
        if not app_type:
            raise HTTPException(status_code=404, detail="Application type not found")
        
        return dict(app_type)

"""Routes for flows"""
from fastapi import APIRouter, HTTPException
from typing import List
from database import db
from models import Flow

router = APIRouter(prefix="/flows", tags=["flows"])


@router.get("/", response_model=List[Flow])
async def get_flows():
    """Get all available flows"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, description, created_at, updated_at
            FROM flows
            ORDER BY name
        """)
        flows = cursor.fetchall()
        return [dict(flow) for flow in flows]


@router.get("/{flow_id}", response_model=Flow)
async def get_flow(flow_id: int):
    """Get a specific flow by ID"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, description, created_at, updated_at
            FROM flows
            WHERE id = %s
        """, (flow_id,))
        flow = cursor.fetchone()
        
        if not flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        return dict(flow)

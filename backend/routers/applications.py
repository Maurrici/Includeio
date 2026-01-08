"""Routes for applications"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from database import db
from models import Application, ApplicationWithFlows, ApplicationWithTypes, ApplicationWithTypesAndFlows, ApplicationType, Flow

router = APIRouter(prefix="/applications", tags=["applications"])


class ApplicationWithStats(BaseModel):
    """Application with evaluation statistics"""
    id: int
    name: str
    link: str
    createdAt: str
    updatedAt: str
    evaluationCount: int
    averageScore: Optional[float] = None


@router.get("/", response_model=List[Application])
async def get_applications():
    """Get all available applications"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            ORDER BY name
        """)
        applications = cursor.fetchall()
        return [dict(app) for app in applications]

@router.get("/with-stats", response_model=List[ApplicationWithStats])
async def get_applications_with_stats():
    """Get all applications with evaluation statistics (count and average score)"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT 
                a.id,
                a.name,
                a.link,
                a.created_at,
                a.updated_at,
                COUNT(e.id) as evaluation_count,
                COALESCE(AVG(e.overall_score), 0) as average_score
            FROM applications a
            LEFT JOIN evaluations e ON a.id = e.application_id
            GROUP BY a.id, a.name, a.link, a.created_at, a.updated_at
            HAVING COUNT(e.id) > 0
            ORDER BY evaluation_count DESC, a.name
        """)
        results = cursor.fetchall()
        
        applications = []
        for row in results:
            app_dict = dict(row)
            app_dict['evaluationCount'] = app_dict.pop('evaluation_count')
            avg_score = app_dict.pop('average_score')
            app_dict['averageScore'] = float(avg_score) if avg_score and avg_score > 0 else None
            # Convert datetime to ISO string
            if app_dict.get('created_at'):
                app_dict['createdAt'] = app_dict.pop('created_at').isoformat()
            else:
                app_dict.pop('created_at', None)
                app_dict['createdAt'] = ''
            if app_dict.get('updated_at'):
                app_dict['updatedAt'] = app_dict.pop('updated_at').isoformat()
            else:
                app_dict.pop('updated_at', None)
                app_dict['updatedAt'] = ''
            applications.append(app_dict)
        
        return applications

@router.get("/{application_id}", response_model=Application)
async def get_application(application_id: int):
    """Get a specific application by ID"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            WHERE id = %s
        """, (application_id,))
        application = cursor.fetchone()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return dict(application)


@router.get("/{application_id}/types", response_model=List[ApplicationType])
async def get_application_types(application_id: int):
    """Get all types available for a specific application"""
    with db.get_cursor() as cursor:
        # First check if application exists
        cursor.execute("SELECT id FROM applications WHERE id = %s", (application_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Get types for this application
        cursor.execute("""
            SELECT at.id, at.name, at.created_at
            FROM application_types at
            INNER JOIN application_application_types aat ON at.id = aat.application_type_id
            WHERE aat.application_id = %s
            ORDER BY at.name
        """, (application_id,))
        types = cursor.fetchall()
        return [dict(t) for t in types]


@router.get("/{application_id}/flows", response_model=List[Flow])
async def get_application_flows(application_id: int):
    """Get all flows available for a specific application"""
    with db.get_cursor() as cursor:
        # First check if application exists
        cursor.execute("SELECT id FROM applications WHERE id = %s", (application_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Get flows for this application
        cursor.execute("""
            SELECT f.id, f.name, f.description, f.created_at, f.updated_at
            FROM flows f
            INNER JOIN application_flows af ON f.id = af.flow_id
            WHERE af.application_id = %s
            ORDER BY f.name
        """, (application_id,))
        flows = cursor.fetchall()
        return [dict(flow) for flow in flows]


@router.get("/{application_id}/with-flows", response_model=ApplicationWithFlows)
async def get_application_with_flows(application_id: int):
    """Get application with its associated flows"""
    with db.get_cursor() as cursor:
        # Get application
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            WHERE id = %s
        """, (application_id,))
        application = cursor.fetchone()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Get flows
        cursor.execute("""
            SELECT f.id, f.name, f.description, f.created_at, f.updated_at
            FROM flows f
            INNER JOIN application_flows af ON f.id = af.flow_id
            WHERE af.application_id = %s
            ORDER BY f.name
        """, (application_id,))
        flows = cursor.fetchall()
        
        result = dict(application)
        result['flows'] = [dict(flow) for flow in flows]
        return result


@router.get("/{application_id}/with-types", response_model=ApplicationWithTypes)
async def get_application_with_types(application_id: int):
    """Get application with its associated types"""
    with db.get_cursor() as cursor:
        # Get application
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            WHERE id = %s
        """, (application_id,))
        application = cursor.fetchone()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Get types
        cursor.execute("""
            SELECT at.id, at.name, at.created_at
            FROM application_types at
            INNER JOIN application_application_types aat ON at.id = aat.application_type_id
            WHERE aat.application_id = %s
            ORDER BY at.name
        """, (application_id,))
        types = cursor.fetchall()
        
        result = dict(application)
        result['types'] = [dict(t) for t in types]
        return result


@router.get("/{application_id}/complete", response_model=ApplicationWithTypesAndFlows)
async def get_application_complete(application_id: int):
    """Get application with its associated types and flows"""
    with db.get_cursor() as cursor:
        # Get application
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            WHERE id = %s
        """, (application_id,))
        application = cursor.fetchone()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Get types
        cursor.execute("""
            SELECT at.id, at.name, at.created_at
            FROM application_types at
            INNER JOIN application_application_types aat ON at.id = aat.application_type_id
            WHERE aat.application_id = %s
            ORDER BY at.name
        """, (application_id,))
        types = cursor.fetchall()
        
        # Get flows
        cursor.execute("""
            SELECT f.id, f.name, f.description, f.created_at, f.updated_at
            FROM flows f
            INNER JOIN application_flows af ON f.id = af.flow_id
            WHERE af.application_id = %s
            ORDER BY f.name
        """, (application_id,))
        flows = cursor.fetchall()
        
        result = dict(application)
        result['types'] = [dict(t) for t in types]
        result['flows'] = [dict(flow) for flow in flows]
        return result


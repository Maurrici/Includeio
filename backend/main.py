"""FastAPI application main file"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import applications, flows, evaluations, application_types

app = FastAPI(
    title="Inclusio API",
    description="API para avaliação de acessibilidade de aplicações",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(applications.router)
app.include_router(application_types.router)
app.include_router(flows.router)
app.include_router(evaluations.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Inclusio API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        from database import db
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

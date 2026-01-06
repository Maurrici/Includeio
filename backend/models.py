"""Pydantic models for request/response validation"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# Application Type Models
class ApplicationType(BaseModel):
    id: int
    name: str
    createdAt: datetime = Field(alias="created_at")
    
    class Config:
        from_attributes = True
        populate_by_name = True


# Application Models
class ApplicationBase(BaseModel):
    name: str
    link: str


class Application(ApplicationBase):
    id: int
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    
    class Config:
        from_attributes = True
        populate_by_name = True


class ApplicationWithTypes(Application):
    types: List[ApplicationType] = []


class ApplicationWithFlows(Application):
    flows: List['Flow'] = []


class ApplicationWithTypesAndFlows(Application):
    types: List[ApplicationType] = []
    flows: List['Flow'] = []


# Flow Models
class FlowBase(BaseModel):
    name: str
    description: Optional[str] = None


class Flow(FlowBase):
    id: int
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    
    class Config:
        from_attributes = True
        populate_by_name = True


# Question Response Models
class QuestionResponse(BaseModel):
    questionId: str
    score: int = Field(..., ge=1, le=5)


# Section Score Models
class SectionScoreBase(BaseModel):
    sectionId: str
    sectionName: str
    rawScore: int = Field(..., ge=5, le=25)
    normalizedScore: float = Field(..., ge=0.0, le=10.0)
    comment: Optional[str] = None
    questions: List[QuestionResponse] = []


class SectionScore(SectionScoreBase):
    id: int
    evaluationId: str = Field(alias="evaluation_id")
    createdAt: datetime = Field(alias="created_at")
    
    class Config:
        from_attributes = True
        populate_by_name = True


# Evaluation Models
class EvaluationBase(BaseModel):
    application_id: int
    application_type_id: int
    flow_id: int
    totalRawScore: int = Field(..., ge=25, le=125)
    normalizedScore: float = Field(..., ge=0.0, le=10.0)
    overallScore: float = Field(..., ge=0.0, le=10.0)
    sectionScores: List[SectionScoreBase]


class EvaluationCreate(EvaluationBase):
    id: Optional[str] = None  # UUID will be generated if not provided


class Evaluation(EvaluationBase):
    id: str
    createdAt: datetime = Field(alias="created_at")
    updatedAt: datetime = Field(alias="updated_at")
    sectionScores: List[SectionScore] = []
    
    class Config:
        from_attributes = True
        populate_by_name = True


class EvaluationWithDetails(Evaluation):
    application: Application
    applicationType: ApplicationType = Field(alias="application_type")
    flow: Flow
    
    class Config:
        from_attributes = True
        populate_by_name = True


# Response Models
class ApplicationFlowResponse(BaseModel):
    application: Application
    flows: List[Flow]


# Update forward references
ApplicationWithFlows.model_rebuild()
ApplicationWithTypes.model_rebuild()
ApplicationWithTypesAndFlows.model_rebuild()
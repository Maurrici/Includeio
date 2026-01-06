"""Routes for evaluations"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
import uuid
from datetime import datetime
from database import db
from models import Evaluation, EvaluationCreate, EvaluationWithDetails, Application, Flow, SectionScore

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


@router.get("/", response_model=List[Evaluation])
async def get_evaluations(limit: Optional[int] = 100, offset: Optional[int] = 0):
    """Get all evaluations with pagination"""
    with db.get_cursor() as cursor:
        cursor.execute("""
            SELECT id, application_id, application_type_id, flow_id, total_raw_score, normalized_score, 
                   overall_score, created_at, updated_at
            FROM evaluations
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))
        evaluations = cursor.fetchall()
        
        result = []
        for eval_data in evaluations:
            eval_dict = dict(eval_data)
            # Get section scores for each evaluation
            cursor.execute("""
                SELECT id, section_id, section_name, raw_score, normalized_score, 
                       comment, created_at
                FROM section_scores
                WHERE evaluation_id = %s
                ORDER BY section_id
            """, (eval_dict['id'],))
            sections = cursor.fetchall()
            
            # Get questions for each section
            section_scores = []
            for section in sections:
                section_dict = dict(section)
                cursor.execute("""
                    SELECT question_id, score
                    FROM question_responses
                    WHERE evaluation_id = %s AND section_id = %s
                    ORDER BY question_id
                """, (eval_dict['id'], section_dict['section_id']))
                questions = cursor.fetchall()
                section_dict['questions'] = [
                    {'questionId': q['question_id'], 'score': q['score']} 
                    for q in questions
                ]
                section_dict['sectionId'] = section_dict.pop('section_id')
                section_dict['sectionName'] = section_dict.pop('section_name')
                section_dict['rawScore'] = section_dict.pop('raw_score')
                section_dict['normalizedScore'] = float(section_dict.pop('normalized_score'))
                # Keep created_at as datetime for Pydantic
                section_scores.append(section_dict)
            
            eval_dict['sectionScores'] = section_scores
            eval_dict['totalRawScore'] = eval_dict.pop('total_raw_score')
            eval_dict['normalizedScore'] = float(eval_dict.pop('normalized_score'))
            eval_dict['overallScore'] = float(eval_dict.pop('overall_score'))
            # Keep application_id, flow_id, created_at and updated_at as they are for Pydantic
            result.append(eval_dict)
        
        return result


@router.get("/{evaluation_id}", response_model=EvaluationWithDetails)
async def get_evaluation(evaluation_id: str):
    """Get a specific evaluation by ID with full details"""
    with db.get_cursor() as cursor:
        # Get evaluation
        cursor.execute("""
            SELECT id, application_id, application_type_id, flow_id, total_raw_score, normalized_score, 
                   overall_score, created_at, updated_at
            FROM evaluations
            WHERE id = %s
        """, (evaluation_id,))
        eval_data = cursor.fetchone()
        
        if not eval_data:
            raise HTTPException(status_code=404, detail="Evaluation not found")
        
        eval_dict = dict(eval_data)
        
        # Get application
        cursor.execute("""
            SELECT id, name, link, created_at, updated_at
            FROM applications
            WHERE id = %s
        """, (eval_dict['application_id'],))
        app_data = cursor.fetchone()
        eval_dict['application'] = dict(app_data)
        
        # Get application type
        cursor.execute("""
            SELECT id, name, created_at
            FROM application_types
            WHERE id = %s
        """, (eval_dict['application_type_id'],))
        type_data = cursor.fetchone()
        eval_dict['application_type'] = dict(type_data)
        
        # Get flow
        cursor.execute("""
            SELECT id, name, description, created_at, updated_at
            FROM flows
            WHERE id = %s
        """, (eval_dict['flow_id'],))
        flow_data = cursor.fetchone()
        eval_dict['flow'] = dict(flow_data)
        
        # Get section scores
        cursor.execute("""
            SELECT id, section_id, section_name, raw_score, normalized_score, 
                   comment, created_at
            FROM section_scores
            WHERE evaluation_id = %s
            ORDER BY section_id
        """, (evaluation_id,))
        sections = cursor.fetchall()
        
        section_scores = []
        for section in sections:
            section_dict = dict(section)
            cursor.execute("""
                SELECT question_id, score
                FROM question_responses
                WHERE evaluation_id = %s AND section_id = %s
                ORDER BY question_id
            """, (evaluation_id, section_dict['section_id']))
            questions = cursor.fetchall()
            section_dict['questions'] = [
                {'questionId': q['question_id'], 'score': q['score']} 
                for q in questions
            ]
            section_dict['sectionId'] = section_dict.pop('section_id')
            section_dict['sectionName'] = section_dict.pop('section_name')
            section_dict['rawScore'] = section_dict.pop('raw_score')
            section_dict['normalizedScore'] = float(section_dict.pop('normalized_score'))
            section_scores.append(section_dict)
        
        eval_dict['sectionScores'] = section_scores
        eval_dict['totalRawScore'] = eval_dict.pop('total_raw_score')
        eval_dict['normalizedScore'] = float(eval_dict.pop('normalized_score'))
        eval_dict['overallScore'] = float(eval_dict.pop('overall_score'))
        # Keep application_id, flow_id, created_at and updated_at as they are for Pydantic
        
        return eval_dict


@router.post("/", response_model=Evaluation, status_code=201)
async def create_evaluation(evaluation: EvaluationCreate):
    """Create a new evaluation"""
    # Generate UUID if not provided
    eval_id = evaluation.id or str(uuid.uuid4())
    
    with db.get_connection() as conn:
        cursor = conn.cursor()
        
        try:
            # Verify application exists
            cursor.execute("SELECT id FROM applications WHERE id = %s", (evaluation.application_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Application not found")
            
            # Verify application type exists and is associated with the application
            cursor.execute("""
                SELECT aat.application_type_id
                FROM application_application_types aat
                WHERE aat.application_id = %s AND aat.application_type_id = %s
            """, (evaluation.application_id, evaluation.application_type_id))
            if not cursor.fetchone():
                raise HTTPException(
                    status_code=400, 
                    detail="Application type is not available for this application"
                )
            
            # Verify flow exists and is associated with the application
            cursor.execute("""
                SELECT af.flow_id
                FROM application_flows af
                WHERE af.application_id = %s AND af.flow_id = %s
            """, (evaluation.application_id, evaluation.flow_id))
            if not cursor.fetchone():
                raise HTTPException(
                    status_code=400, 
                    detail="Flow is not available for this application"
                )
            
            # Insert evaluation
            cursor.execute("""
                INSERT INTO evaluations (id, application_id, application_type_id, flow_id, total_raw_score, 
                                      normalized_score, overall_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                eval_id,
                evaluation.application_id,
                evaluation.application_type_id,
                evaluation.flow_id,
                evaluation.totalRawScore,
                evaluation.normalizedScore,
                evaluation.overallScore
            ))
            
            # Insert section scores and question responses
            for section in evaluation.sectionScores:
                cursor.execute("""
                    INSERT INTO section_scores (evaluation_id, section_id, section_name, 
                                              raw_score, normalized_score, comment)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    eval_id,
                    section.sectionId,
                    section.sectionName,
                    section.rawScore,
                    section.normalizedScore,
                    section.comment
                ))
                section_id_db = cursor.fetchone()[0]
                
                # Insert question responses
                for question in section.questions:
                    cursor.execute("""
                        INSERT INTO question_responses (evaluation_id, section_id, question_id, score)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        eval_id,
                        section.sectionId,
                        question.questionId,
                        question.score
                    ))
            
            conn.commit()
            
            # Return created evaluation
            return await get_evaluation(eval_id)
            
        except HTTPException:
            conn.rollback()
            raise
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating evaluation: {str(e)}")
        finally:
            cursor.close()


@router.delete("/{evaluation_id}", status_code=204)
async def delete_evaluation(evaluation_id: str):
    """Delete an evaluation"""
    with db.get_connection() as conn:
        cursor = conn.cursor()
        
        try:
            cursor.execute("SELECT id FROM evaluations WHERE id = %s", (evaluation_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Evaluation not found")
            
            # Delete will cascade to section_scores and question_responses
            cursor.execute("DELETE FROM evaluations WHERE id = %s", (evaluation_id,))
            conn.commit()
            
        except HTTPException:
            conn.rollback()
            raise
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting evaluation: {str(e)}")
        finally:
            cursor.close()

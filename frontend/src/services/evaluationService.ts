import { Evaluation } from '@/types/evaluation';
import { Application, ApplicationType, Flow, ApplicationWithStats, ApplicationEvaluationsSummary } from '@/types/evaluation';

const API_BASE_URL = '/api';

/**
 * Evaluation service for managing evaluations via API
 */
export class EvaluationService {
  /**
   * Get all evaluations
   */
  static async getAll(): Promise<Evaluation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations`);
      if (!response.ok) throw new Error('Failed to fetch evaluations');
      const backendEvaluations = await response.json();
      
      // Map backend format to frontend format
      return backendEvaluations.map((evaluation: any) => ({
        id: evaluation.id,
        applicationName: evaluation.application?.name || 'Unknown',
        flow: evaluation.flow && typeof evaluation.flow === 'object' 
          ? { name: evaluation.flow.name, id: evaluation.flow.id, description: evaluation.flow.description } 
          : (evaluation.flow?.name || 'Unknown'),
        applicationType: evaluation.applicationType?.name || undefined,
        applicationLink: evaluation.application?.link || undefined,
        totalRawScore: evaluation.totalRawScore,
        normalizedScore: evaluation.normalizedScore,
        overallScore: evaluation.overallScore,
        sectionScores: evaluation.sectionScores || [],
        createdAt: evaluation.createdAt,
        updatedAt: evaluation.updatedAt
      }));
    } catch (error) {
      console.error('Error loading evaluations:', error);
      return [];
    }
  }

  /**
   * Get evaluation by ID
   */
  static async getById(id: string): Promise<Evaluation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations/${id}`);
      if (!response.ok) return null;
      const evaluation = await response.json();
      
      // Map backend format to frontend format
      return {
        id: evaluation.id,
        applicationName: evaluation.application?.name || 'Unknown',
        flow: evaluation.flow && typeof evaluation.flow === 'object' 
          ? { name: evaluation.flow.name, id: evaluation.flow.id, description: evaluation.flow.description } 
          : (evaluation.flow?.name || 'Unknown'),
        applicationType: evaluation.applicationType?.name || undefined,
        applicationLink: evaluation.application?.link || undefined,
        totalRawScore: evaluation.totalRawScore,
        normalizedScore: evaluation.normalizedScore,
        overallScore: evaluation.overallScore,
        sectionScores: evaluation.sectionScores || [],
        createdAt: evaluation.createdAt,
        updatedAt: evaluation.updatedAt
      };
    } catch (error) {
      console.error('Error loading evaluation:', error);
      return null;
    }
  }

  /**
   * Save a new evaluation
   */
  static async save(evaluation: {
    application_id: number;
    application_type_id: number;
    flow_id: number;
    totalRawScore: number;
    normalizedScore: number;
    overallScore: number;
    sectionScores: Array<{
      sectionId: string;
      sectionName: string;
      rawScore: number;
      normalizedScore: number;
      comment: string;
      questions: Array<{ questionId: string; score: number }>;
    }>;
  }): Promise<Evaluation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluation),
      });
      if (!response.ok) throw new Error('Failed to save evaluation');
      return await response.json();
    } catch (error) {
      console.error('Error saving evaluation:', error);
      return null;
    }
  }

  /**
   * Delete an evaluation
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      return false;
    }
  }

  /**
   * Update an evaluation
   */
  static async update(id: string, evaluation: Partial<Evaluation>): Promise<Evaluation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluation),
      });
      if (!response.ok) throw new Error('Failed to update evaluation');
      return await response.json();
    } catch (error) {
      console.error('Error updating evaluation:', error);
      return null;
    }
  }

  /**
   * Get all applications
   */
  static async getApplications(): Promise<Application[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error) {
      console.error('Error loading applications:', error);
      return [];
    }
  }

  /**
   * Get application types for a specific application
   */
  static async getApplicationTypes(applicationId: number): Promise<ApplicationType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/types`);
      if (!response.ok) throw new Error('Failed to fetch application types');
      return await response.json();
    } catch (error) {
      console.error('Error loading application types:', error);
      return [];
    }
  }

  /**
   * Get flows for a specific application
   */
  static async getApplicationFlows(applicationId: number): Promise<Flow[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/flows`);
      if (!response.ok) throw new Error('Failed to fetch application flows');
      return await response.json();
    } catch (error) {
      console.error('Error loading application flows:', error);
      return [];
    }
  }

  /**
   * Get applications with evaluation statistics
   */
  static async getApplicationsWithStats(): Promise<ApplicationWithStats[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/with-stats`);
      if (!response.ok) throw new Error('Failed to fetch applications with stats');
      return await response.json();
    } catch (error) {
      console.error('Error loading applications with stats:', error);
      return [];
    }
  }

  /**
   * Get evaluations for a specific application, grouped by type
   */
  static async getEvaluationsByApplication(applicationId: number): Promise<ApplicationEvaluationsSummary | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluations/by-application/${applicationId}`);
      if (!response.ok) return null;
      const data = await response.json();
      
      // Map backend format to frontend format
      return {
        application: data.application,
        totalCount: data.totalCount,
        averageScore: data.averageScore,
        evaluationsByType: data.evaluationsByType.map((group: any) => ({
          applicationType: group.applicationType,
          count: group.count,
          averageScore: group.averageScore,
          evaluations: group.evaluations.map((evaluation: any) => ({
            id: evaluation.id,
            applicationName: data.application.name,
            flow: evaluation.flow && typeof evaluation.flow === 'object' 
              ? { name: evaluation.flow.name, id: evaluation.flow.id, description: evaluation.flow.description } 
              : (evaluation.flow?.name || 'Unknown'),
            applicationType: group.applicationType.name,
            applicationLink: data.application.link,
            totalRawScore: evaluation.totalRawScore,
            normalizedScore: evaluation.normalizedScore,
            overallScore: evaluation.overallScore,
            sectionScores: (evaluation.sectionScores || []).map((section: any) => ({
              sectionId: section.sectionId,
              sectionName: section.sectionName,
              rawScore: section.rawScore,
              normalizedScore: section.normalizedScore,
              questions: section.questions || [],
              comment: section.comment || ''
            })),
            createdAt: evaluation.createdAt || evaluation.created_at,
            updatedAt: evaluation.updatedAt || evaluation.updated_at
          }))
        }))
      };
    } catch (error) {
      console.error('Error loading evaluations by application:', error);
      return null;
    }
  }
}
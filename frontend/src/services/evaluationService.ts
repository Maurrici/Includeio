import { Evaluation } from '@/types/evaluation';
import { Application, ApplicationType, Flow } from '@/types/evaluation';

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
        flow: evaluation.flow?.name || 'Unknown',
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
        flow: evaluation.flow?.name || 'Unknown',
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
}
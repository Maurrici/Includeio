import { Evaluation } from '@/types/evaluation';

const STORAGE_KEY = 'inclusio_evaluations';

/**
 * Evaluation service for managing evaluations
 * Currently uses localStorage, but structured to easily migrate to MySQL
 */
export class EvaluationService {
  /**
   * Get all evaluations
   */
  static getAll(): Evaluation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as Evaluation[];
    } catch (error) {
      console.error('Error loading evaluations:', error);
      return [];
    }
  }

  /**
   * Get evaluation by ID
   */
  static getById(id: string): Evaluation | null {
    const evaluations = this.getAll();
    return evaluations.find(e => e.id === id) || null;
  }

  /**
   * Save a new evaluation
   */
  static save(evaluation: Evaluation): void {
    const evaluations = this.getAll();
    evaluations.push(evaluation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  }

  /**
   * Delete an evaluation
   */
  static delete(id: string): boolean {
    const evaluations = this.getAll();
    const filtered = evaluations.filter(e => e.id !== id);
    if (filtered.length === evaluations.length) {
      return false; // Not found
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Clear all evaluations (for testing/reset)
   */
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Future MySQL implementation would look like:
 * 
 * export class EvaluationService {
 *   static async getAll(): Promise<Evaluation[]> {
 *     const connection = await mysql.createConnection(config);
 *     const [evaluations] = await connection.execute(`
 *       SELECT e.*, 
 *         JSON_ARRAYAGG(JSON_OBJECT(
 *           'sectionId', ss.section_id,
 *           'sectionName', ss.section_name,
 *           'rawScore', ss.raw_score,
 *           'normalizedScore', ss.normalized_score
 *         )) as sectionScores
 *       FROM evaluations e
 *       LEFT JOIN section_scores ss ON e.id = ss.evaluation_id
 *       GROUP BY e.id
 *       ORDER BY e.created_at DESC
 *     `);
 *     return evaluations;
 *   }
 *   
 *   static async save(evaluation: Evaluation): Promise<void> {
 *     const connection = await mysql.createConnection(config);
 *     await connection.beginTransaction();
 *     try {
 *       await connection.execute(`
 *         INSERT INTO evaluations (id, application_name, flow, ...)
 *         VALUES (?, ?, ?, ...)
 *       `, [evaluation.id, evaluation.applicationName, ...]);
 *       
 *       for (const section of evaluation.sectionScores) {
 *         await connection.execute(`
 *           INSERT INTO section_scores (evaluation_id, section_id, ...)
 *           VALUES (?, ?, ...)
 *         `, [evaluation.id, section.sectionId, ...]);
 *       }
 *       
 *       await connection.commit();
 *     } catch (error) {
 *       await connection.rollback();
 *       throw error;
 *     }
 *   }
 * }
 */


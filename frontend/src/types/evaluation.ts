/**
 * Evaluation data model - MySQL ready
 * 
 * Database schema would be:
 * 
 * CREATE TABLE evaluations (
 *   id VARCHAR(36) PRIMARY KEY,
 *   application_name VARCHAR(255) NOT NULL,
 *   flow VARCHAR(500) NOT NULL,
 *   application_type VARCHAR(255),
 *   application_link VARCHAR(500),
 *   total_raw_score INT NOT NULL, -- 25-125
 *   normalized_score DECIMAL(4,2) NOT NULL, -- 0.00-10.00
 *   overall_score DECIMAL(4,2) NOT NULL, -- 0.00-10.00 (same as normalized_score)
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE section_scores (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   evaluation_id VARCHAR(36) NOT NULL,
 *   section_id VARCHAR(50) NOT NULL,
 *   section_name VARCHAR(255) NOT NULL,
 *   raw_score INT NOT NULL, -- 5-25 (5 questions * 1-5)
 *   normalized_score DECIMAL(4,2) NOT NULL, -- 0.00-10.00
 *   FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
 * );
 * 
 * CREATE TABLE question_responses (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   evaluation_id VARCHAR(36) NOT NULL,
 *   section_id VARCHAR(50) NOT NULL,
 *   question_id VARCHAR(10) NOT NULL,
 *   score INT NOT NULL, -- 1-5
 *   FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
 * );
 * 
 * CREATE TABLE section_comments (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   evaluation_id VARCHAR(36) NOT NULL,
 *   section_id VARCHAR(50) NOT NULL,
 *   comment TEXT NOT NULL,
 *   FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
 * );
 */

export interface QuestionResponse {
  questionId: string;
  score: number; // 1-5
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  rawScore: number; // 5-25 (5 questions * 1-5)
  normalizedScore: number; // 0-10
  questions: QuestionResponse[];
  comment: string;
}

export interface Evaluation {
  id: string;
  applicationName: string;
  flow: string;
  applicationType?: string;
  applicationLink?: string;
  totalRawScore: number; // 25-125 (25 questions * 1-5)
  normalizedScore: number; // 0-10
  overallScore: number; // 0-10 (same as normalizedScore)
  sectionScores: SectionScore[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Normalize a raw score from min-max range to 0-10 scale
 * Formula: normalized = ((raw - min) / (max - min)) * 10
 */
export function normalizeScore(rawScore: number, minScore: number, maxScore: number): number {
  if (maxScore === minScore) return 10; // Avoid division by zero
  return ((rawScore - minScore) / (maxScore - minScore)) * 10;
}

/**
 * Calculate section score from question responses
 */
export function calculateSectionScore(questions: QuestionResponse[]): {
  rawScore: number;
  normalizedScore: number;
} {
  const rawScore = questions.reduce((sum, q) => sum + q.score, 0);
  const minScore = questions.length * 1; // All 1s
  const maxScore = questions.length * 5; // All 5s
  const normalizedScore = normalizeScore(rawScore, minScore, maxScore);
  
  return { rawScore, normalizedScore };
}

/**
 * Calculate overall evaluation score
 */
export function calculateOverallScore(sectionScores: SectionScore[]): {
  totalRawScore: number;
  normalizedScore: number;
} {
  const totalRawScore = sectionScores.reduce((sum, section) => sum + section.rawScore, 0);
  const minScore = 25; // 25 questions * 1
  const maxScore = 125; // 25 questions * 5
  const normalizedScore = normalizeScore(totalRawScore, minScore, maxScore);
  
  return { totalRawScore, normalizedScore };
}

// Backend API types
export interface Application {
  id: number;
  name: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationType {
  id: number;
  name: string;
  createdAt: string;
}

export interface Flow {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}


-- MySQL Database Schema for Inclusio Evaluations
-- This schema supports the evaluation data model

CREATE TABLE evaluations (
  id VARCHAR(36) PRIMARY KEY,
  application_name VARCHAR(255) NOT NULL,
  flow VARCHAR(500) NOT NULL,
  application_type VARCHAR(255),
  application_link VARCHAR(500),
  total_raw_score INT NOT NULL COMMENT '25-125 (25 questions * 1-5)',
  normalized_score DECIMAL(4,2) NOT NULL COMMENT '0.00-10.00',
  overall_score DECIMAL(4,2) NOT NULL COMMENT '0.00-10.00 (same as normalized_score)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_application_name (application_name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE section_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_id VARCHAR(36) NOT NULL,
  section_id VARCHAR(50) NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  raw_score INT NOT NULL COMMENT '5-25 (5 questions * 1-5)',
  normalized_score DECIMAL(4,2) NOT NULL COMMENT '0.00-10.00',
  comment TEXT,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
  INDEX idx_evaluation_id (evaluation_id),
  INDEX idx_section_id (section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE question_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_id VARCHAR(36) NOT NULL,
  section_id VARCHAR(50) NOT NULL,
  question_id VARCHAR(10) NOT NULL,
  score INT NOT NULL COMMENT '1-5',
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
  INDEX idx_evaluation_id (evaluation_id),
  INDEX idx_section_question (section_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example queries:

-- Get all evaluations with section scores
SELECT 
  e.*,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'sectionId', ss.section_id,
      'sectionName', ss.section_name,
      'rawScore', ss.raw_score,
      'normalizedScore', ss.normalized_score,
      'comment', ss.comment
    )
  ) as sectionScores
FROM evaluations e
LEFT JOIN section_scores ss ON e.id = ss.evaluation_id
GROUP BY e.id
ORDER BY e.created_at DESC;

-- Get evaluation with all details
SELECT 
  e.*,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'sectionId', ss.section_id,
      'sectionName', ss.section_name,
      'rawScore', ss.raw_score,
      'normalizedScore', ss.normalized_score,
      'comment', ss.comment,
      'questions', (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'questionId', qr.question_id,
            'score', qr.score
          )
        )
        FROM question_responses qr
        WHERE qr.evaluation_id = e.id AND qr.section_id = ss.section_id
      )
    )
  ) as sectionScores
FROM evaluations e
LEFT JOIN section_scores ss ON e.id = ss.evaluation_id
WHERE e.id = ?
GROUP BY e.id, ss.id;


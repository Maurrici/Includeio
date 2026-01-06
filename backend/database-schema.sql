-- PostgreSQL Database Schema for Inclusio Evaluations
-- This schema supports the evaluation data model with predefined applications and flows

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS question_responses CASCADE;
DROP TABLE IF EXISTS section_scores CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS application_application_types CASCADE;
DROP TABLE IF EXISTS application_flows CASCADE;
DROP TABLE IF EXISTS application_types CASCADE;
DROP TABLE IF EXISTS flows CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

-- Application types table - predefined types
CREATE TABLE application_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table - predefined applications that users can evaluate
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  link VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application-Application Type relationship table (many-to-many)
-- Defines which types are available for each application
CREATE TABLE application_application_types (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  application_type_id INTEGER NOT NULL REFERENCES application_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(application_id, application_type_id)
);

-- Flows table - predefined flows that can be evaluated
CREATE TABLE flows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application-Flow relationship table (many-to-many)
-- Defines which flows are available for each application
CREATE TABLE application_flows (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  flow_id INTEGER NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(application_id, flow_id)
);

-- Evaluations table - modified to reference applications, types and flows
CREATE TABLE evaluations (
  id VARCHAR(36) PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
  application_type_id INTEGER NOT NULL REFERENCES application_types(id) ON DELETE RESTRICT,
  flow_id INTEGER NOT NULL REFERENCES flows(id) ON DELETE RESTRICT,
  total_raw_score INT NOT NULL CHECK (total_raw_score >= 25 AND total_raw_score <= 125),
  normalized_score DECIMAL(4,2) NOT NULL CHECK (normalized_score >= 0.00 AND normalized_score <= 10.00),
  overall_score DECIMAL(4,2) NOT NULL CHECK (overall_score >= 0.00 AND overall_score <= 10.00),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT evaluations_scores_match CHECK (normalized_score = overall_score)
);

-- Section scores table
CREATE TABLE section_scores (
  id SERIAL PRIMARY KEY,
  evaluation_id VARCHAR(36) NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  section_id VARCHAR(50) NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  raw_score INT NOT NULL CHECK (raw_score >= 5 AND raw_score <= 25),
  normalized_score DECIMAL(4,2) NOT NULL CHECK (normalized_score >= 0.00 AND normalized_score <= 10.00),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question responses table
CREATE TABLE question_responses (
  id SERIAL PRIMARY KEY,
  evaluation_id VARCHAR(36) NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  section_id VARCHAR(50) NOT NULL,
  question_id VARCHAR(10) NOT NULL,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_evaluations_application_id ON evaluations(application_id);
CREATE INDEX idx_evaluations_application_type_id ON evaluations(application_type_id);
CREATE INDEX idx_evaluations_flow_id ON evaluations(flow_id);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at);
CREATE INDEX idx_section_scores_evaluation_id ON section_scores(evaluation_id);
CREATE INDEX idx_section_scores_section_id ON section_scores(section_id);
CREATE INDEX idx_question_responses_evaluation_id ON question_responses(evaluation_id);
CREATE INDEX idx_question_responses_section_question ON question_responses(section_id, question_id);
CREATE INDEX idx_application_flows_application_id ON application_flows(application_id);
CREATE INDEX idx_application_flows_flow_id ON application_flows(flow_id);
CREATE INDEX idx_application_application_types_application_id ON application_application_types(application_id);
CREATE INDEX idx_application_application_types_type_id ON application_application_types(application_type_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

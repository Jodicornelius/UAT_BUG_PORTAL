/*
 * DATABASE SETUP
 */

CREATE DATABASE IF NOT EXISTS bug_portal;
USE bug_portal;

/*
 * DROP TABLE
 */

DROP TABLE IF EXISTS bug_reports;

/* 
 * MAIN TABLE: BUG REPORTS
 */

CREATE TABLE bug_reports (

    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    module VARCHAR(255) NOT NULL,

    steps TEXT NOT NULL,
    expected_result TEXT NOT NULL,
    actual_result TEXT NOT NULL,

    severity ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
    environment ENUM('Chrome', 'Safari', 'Firefox', 'Edge', 'Other') NOT NULL,

    tester_name VARCHAR(255) NOT NULL,

    /* Screenshot upload support */
    screenshot VARCHAR(255) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 * SAMPLE DATA (OPTIONAL TEST RECORD)
 * This is just a sample bug report to verify that the table is working correctly. In a real application, this data would come from user submissions through the frontend interface.
 */

INSERT INTO bug_reports
(title, module, steps, expected_result, actual_result, severity, environment, tester_name, screenshot)
VALUES
(
    'Login button not responding',
    'Authentication',
    '1. Open login page 2. Enter credentials 3. Click login',
    'User should be logged in',
    'Button does nothing',
    'Critical',
    'Chrome',
    'Jodi Cornelius',
    NULL
);

/*
 * DASHBOARD VIEW (FOR COUNTERS)
 */

CREATE OR REPLACE VIEW bug_summary AS
SELECT
    COUNT(*) AS total_bugs,

    SUM(CASE WHEN severity = 'Critical' THEN 1 ELSE 0 END) AS critical_bugs,
    SUM(CASE WHEN severity = 'High' THEN 1 ELSE 0 END) AS high_bugs,
    SUM(CASE WHEN severity = 'Medium' THEN 1 ELSE 0 END) AS medium_bugs,
    SUM(CASE WHEN severity = 'Low' THEN 1 ELSE 0 END) AS low_bugs

FROM bug_reports;

/*
 * USEFUL FILTER QUERIES
 */

-- View all bugs
SELECT * FROM bug_reports ORDER BY created_at DESC;

-- Critical bugs only
SELECT * FROM bug_reports
WHERE severity = 'Critical'
ORDER BY created_at DESC;

-- High priority bugs
SELECT * FROM bug_reports
WHERE severity = 'High'
ORDER BY created_at DESC;

/*S
 * VERIFY DATA
 */

SELECT COUNT(*) AS total_records FROM bug_reports;
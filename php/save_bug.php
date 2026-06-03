<?php
/*
 * Save Bug Report
 */

// Include database connection file
include "php/db.php";

// RETRIEVE FORM DATA
// Extract form fields using null coalescing operator to provide empty string defaults
$title = $_POST['title'] ?? '';
$module = $_POST['module'] ?? '';
$steps = $_POST['steps'] ?? '';
$expected = $_POST['expected'] ?? '';
$actual = $_POST['actual'] ?? '';
$severity = $_POST['severity'] ?? '';
$environment = $_POST['environment'] ?? '';
$tester = $_POST['tester'] ?? '';

// Initialize screenshot path as null (will be set if file is uploaded)
$screenshotPath = null;

// HANDLE FILE UPLOAD
// Check if a screenshot file was uploaded and no error occurred
if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] == 0) {

    // Define directory for storing uploaded files
    $uploadDir = "../uploads/";

    // Create uploads directory if it doesn't exist (with 0777 permissions)
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique filename using timestamp to avoid filename conflicts
    $fileName = time() . "_" . basename($_FILES["screenshot"]["name"]);
    
    // Construct full path for the target file
    $targetFile = $uploadDir . $fileName;

    // Move uploaded file from temporary location to uploads directory
    move_uploaded_file($_FILES["screenshot"]["tmp_name"], $targetFile);

    // Store the screenshot file path for database insertion
    $screenshotPath = $targetFile;
}

// PREPARE AND EXECUTE INSERT QUERY
// SQL query to insert new bug report with all fields
$sql = "INSERT INTO bug_reports 
(title, module, steps, expected_result, actual_result, severity, environment, tester_name, screenshot)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare($sql);

// Bind all parameters as strings (s) to the prepared statement in the correct order
$stmt->bind_param(
    "sssssssss",
    $title,
    $module,
    $steps,
    $expected,
    $actual,
    $severity,
    $environment,
    $tester,
    $screenshotPath
);

// Execute the prepared statement to insert the bug report into the database
$stmt->execute();

// Return JSON response indicating successful insertion
echo json_encode(["status" => "success"]);
?>
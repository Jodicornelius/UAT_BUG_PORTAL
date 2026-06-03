<?php
/*
 * Delete Bug Report
 */

// Include database connection file
include "php/db.php";

// Retrieve JSON data from request body and decode it to an associative array
$data = json_decode(file_get_contents("php://input"), true);

// Extract the bug ID from the decoded JSON data
$id = $data['id'];

// Prepare SQL DELETE statement with parameterized query to prevent SQL injection
$stmt = $conn->prepare("DELETE FROM bug_reports WHERE id = ?");

// Bind the bug ID parameter as an integer to the prepared statement
$stmt->bind_param("i", $id);

// Execute the prepared statement
$stmt->execute();

// Return JSON response confirming deletion
echo json_encode(["status" => "deleted"]);
?>
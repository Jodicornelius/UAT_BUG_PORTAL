<?php
/*
 * Retrieve All Bug Reports
 */

// Include database connection file
include "php/db.php";

// Execute SQL query to retrieve all bug reports ordered by creation date (newest first)
$result = $conn->query("SELECT * FROM bug_reports ORDER BY created_at DESC");

// Initialize empty array to store bug records
$bugs = [];

// Loop through each row in the query result and add it to the bugs array
while ($row = $result->fetch_assoc()) {
    $bugs[] = $row;
}

// Return all bug reports as a JSON encoded array
echo json_encode($bugs);
?>
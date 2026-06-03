<?php
/*
 * Database Configuration and Connection
 */

// Database connection parameters
$host = "localhost";
$username = "root";
$password = "";
$dbname = "bug_portal";

// Create new MySQLi connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check if connection failed
if($conn -> connect_error){
    die("Connection failed:" .$conn -> connect_error);
}
?>
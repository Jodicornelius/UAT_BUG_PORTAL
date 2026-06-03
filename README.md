# UAT Bug Portal - Setup Guide

## Project Overview
The UAT Bug Portal is a simple fullstack bug tracking system that allows users to:
- Submit bug reports
- View submitted reports in real time
- Delete bug reports
- Export reports
- Store data in a MySQL database (XAMPP)

---

## Requirements
Make sure you have the following installed:

- XAMPP (Apache + MySQL)
- VS Code
- Web browser (Chrome recommended)

---

## How to Run the Project

### 1. Start XAMPP
Open XAMPP Control Panel and start:
- Apache
- MySQL

---

### 2. Import Database

1. Open browser
2. Go to: http://localhost/phpmyadmin
3. Create a new database: bug_portal
4. Import the SQL file or run the schema provided.

---

### 3. Move Project to htdocs

Place your project folder inside: C:\xampp\htdocs\UAT_BUG\


---

### 4. Configure Database Connection

Check `php/db.php`:

```php
<?php
$conn = new mysqli("localhost", "root", "", "bug_portal");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>


---

### 5. Run Project
 Open browser and go to: http://localhost/UAT_BUG/index.html
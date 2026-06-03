
---

# TESTING.md (Test Notes)

```md
# UAT Bug Portal - Testing Documentation

## Test 1: Submit Bug Report

### Steps:
1. Open the application
2. Fill in all fields:
   - Title
   - Module
   - Steps
   - Expected Result
   - Actual Result
   - Severity
   - Environment
   - Tester Name
3. Click Submit

### Expected Result:
- Bug appears in Reports counter section
- Counter increases
- Success popup appears

---

## Test 2: Delete Bug Report

### Steps:
1. Submit a bug report
2. Click "Delete" button

### Expected Result:
- Bug is removed
- Counters update correctly

---

## Test 3: Export Reports

### Steps:
1. Add multiple bug reports
2. Click Export button in header

### Expected Result:
- A `.txt` file downloads
- Contains all bug data

---

## Test 4: Database Storage

### Steps:
1. Submit a bug
2. Open phpMyAdmin
3. Check `bug_reports` table

### Expected Result:
- Data is saved correctly in database

---

## Test 5: Screenshot Upload

### Steps:
1. Upload an image with bug report
2. Submit form

### Expected Result:
- Image saves in `/uploads`
- File path stored in database

---

## Known Issues (if any)

- Upload path may fail if `uploads/` folder is missing
- 404 error occurs if project is not in `htdocs`
- Images may not load in the Report section or in the .txt file after Exporting
- May need to reset the form if incorrect images has been uploaded
- Cant view uploaded file

---

## Conclusion
System is fully functional as a basic fullstack bug tracking application.
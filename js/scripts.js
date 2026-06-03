
const bugForm = document.getElementById("bug_form");                          // Main bug report form
const bugCount = document.getElementById("bug_count");                        // Total bug count display
const criticalCount = document.getElementById("critical_risk_count");         // Critical severity counter
const highCount = document.getElementById("high_risk_count");                 // High severity counter
const mediumCount = document.getElementById("medium_risk_count");             // Medium severity counter
const resolvedCount = document.getElementById("low_risk_count");              // Low severity counter

const reportCounter = document.getElementById("reportCounter");               // Report counter display
const reportList = document.getElementById("reportList");                     // Container for bug report cards

const exportBtn = document.getElementById("export_btn");                      // Export button

const uploadBox = document.querySelector(".upload_box");                      // File upload drag-drop area
const fileInput = document.getElementById("fileInput");                       // Hidden file input element

// UPLOAD FILE

// Handles drag-drop and click-to-upload for files
if (uploadBox && fileInput) {

    // Click on upload box to trigger file input dialog
    uploadBox.addEventListener("click", () => fileInput.click());

    // Add visual feedback when file is dragged over the upload box
    uploadBox.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadBox.classList.add("dragover");
    });

    // Remove visual feedback when file is dragged away
    uploadBox.addEventListener("dragleave", () => {
        uploadBox.classList.remove("dragover");
    });

    // Handle dropped files and update the file input
    uploadBox.addEventListener("drop", (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        updateFileText();
    });

    // Update file text when user selects file via dialog
    fileInput.addEventListener("change", updateFileText);

    /*
     * Update the upload box text to show number of selected files
     */
    function updateFileText() {
        const p = uploadBox.querySelector("p");
        if (p) {
            p.textContent = `${fileInput.files.length} file(s) selected`;
        }
    }
}


// LOAD BUG REPORTS FROM DB

/*
 * Fetch all bug reports from the server and display them
 * Updates severity counters
 */
async function loadReports() {

    // Fetch bug data from PHP backend
    const res = await fetch("php/get_bugs.php");
    const data = await res.json();

    // Clear existing report cards
    reportList.innerHTML = "";

    // Create a report card for each bug
    data.forEach(addReport);

    // Update severity and total counters
    updateCounters(data);
}


// CREATE AND DISPLAY BUG REPORT CARD

/*
 * Create a visual card for a bug report with all details in it
 * @param {Object} data - Bug report object from database
 */
function addReport(data) {

    // Create container div for the report card
    const div = document.createElement("div");
    div.classList.add("report_item");
    // Add severity class for styling (critical, high, medium, low)
    div.classList.add(data.severity.toLowerCase());

    // Populate card with bug report information
    div.innerHTML = `
        <h3>${data.title}</h3>
        <p><b>Module:</b> ${data.module}</p>
        <p><b>Severity:</b> ${data.severity}</p>
        <p><b>Environment:</b> ${data.environment}</p>
        <p><b>Steps:</b> ${data.steps}</p>
        <p><b>Expected:</b> ${data.expected_result}</p>
        <p><b>Actual:</b> ${data.actual_result}</p>
        <p><b>Tester:</b> ${data.tester_name}</p>

        ${data.screenshot ? `<img src="${data.screenshot}" width="120">` : ""}

        <button class="delete_btn">Delete</button>
    `;

    // Attach delete functionality to the delete button
    div.querySelector(".delete_btn").addEventListener("click", async () => {

        // Send DELETE request with bug ID to backend
        await fetch("php/delete_bug.php", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
            headers: { "Content-Type": "application/json" }
        });

        // Reload reports to reflect deletion
        loadReports();
    });

    // Add the card to the report list
    reportList.appendChild(div);
}

// UPDATE SEVERITY COUNTERS
/*
 * Count bugs by severity level and update counter displays
 * @param {Array} data - Array of bug report objects
 */
function updateCounters(data) {

    // Initialize counters for each severity level
    let critical = 0, high = 0, medium = 0, low = 0;

    // Loop through all bugs and count by severity
    data.forEach(b => {
        const s = b.severity.toLowerCase();
        if (s === "critical") critical++;
        if (s === "high") high++;
        if (s === "medium") medium++;
        if (s === "low") low++;
    });

    // Update DOM elements with counter values
    bugCount.textContent = data.length;
    criticalCount.textContent = critical;
    highCount.textContent = high;
    mediumCount.textContent = medium;
    resolvedCount.textContent = low;

    // Update report counter display
    reportCounter.textContent = `${data.length} Reports`;
}

// SUBMIT BUG REPORT FORM
/*
 * Handle form submission: collect data, upload file, and save bug report
 * Uses FormData to properly handle file uploads
 */
bugForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Create FormData object to handle both text and file data
    const formData = new FormData();

    // Append all form field values to FormData
    formData.append("title", bug_title.value);
    formData.append("module", app_feature.value);
    formData.append("steps", bug_steps.value);
    formData.append("expected", expected_result.value);
    formData.append("actual", actual_result.value);
    formData.append("severity", severity_btn.value);
    formData.append("environment", environment_btn.value);
    formData.append("tester", tester_credentials.value);

    // Append screenshot file if one was selected
    if (fileInput.files[0]) {
        formData.append("screenshot", fileInput.files[0]);
    }

    // Send FormData to backend without Content-Type header
    // (browser will automatically set it with boundary)
    await fetch("php/save_bug.php", {
        method: "POST",
        body: formData
    });

    // Notify user of successful submission
    alert("Bug Report Submitted Successfully!");

    // Clear form fields
    bugForm.reset();
    fileInput.value = "";
    uploadBox.querySelector("p").textContent =
        "Drag & Drop files or click to upload";

    // Reload reports to display the newly created bug
    loadReports();
});

// EXPORT BUG REPORTS AS TEXT FILE
/*
 * Export all bug reports to a downloadable .txt file
 * Creates a formatted text document with all bug details
 */
exportBtn.addEventListener("click", async () => {

    // Fetch all bug reports from backend
    const res = await fetch("php/get_bugs.php");
    const data = await res.json();

    // Format bug data into readable text with separators
    let text = data.map(b => `
${b.title}
Module: ${b.module}
Severity: ${b.severity}
Steps: ${b.steps}
Expected: ${b.expected_result}
Actual: ${b.actual_result}
Tester: ${b.tester_name}
`).join("\n-----------------\n");

    // Create blob from formatted text
    const blob = new Blob([text], { type: "text/plain" });

    // Create temporary download link and trigger download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bug_reports.txt";
    a.click();
});

// INITIALIZATION
// Load and display bug reports when page loads
loadReports();
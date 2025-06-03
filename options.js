/*
  options.js for Send by Gmail Firefox Extension
  © John Navas 2025, All Rights Reserved
  This script manages the options page for the extension.
  It saves and restores the user's subject prefix using Firefox's storage.sync,
  ensuring settings are synchronized across devices.
*/

// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Retrieve the subjectPrefix value from Firefox's sync storage
        let { subjectPrefix } = await browser.storage.sync.get('subjectPrefix');
        // Set the input field to the stored value, or leave empty if not set
        document.getElementById('subjectPrefix').value = subjectPrefix || "";
    } catch (error) {
        // Log any errors (e.g., storage access issues)
        console.error("Failed to load subject prefix from storage.sync:", error);
        document.getElementById('status').textContent = "Error loading settings.";
    }
});

// Handle the Save button click event to store the subject prefix in storage.sync
document.getElementById('save').addEventListener('click', async () => {
    // Get the value entered by the user
    let prefix = document.getElementById('subjectPrefix').value;
    try {
        // Save the prefix to Firefox's sync storage for cross-device syncing
        await browser.storage.sync.set({ subjectPrefix: prefix });
        // Show a confirmation message to the user
        document.getElementById('status').textContent = "Saved!";
    } catch (error) {
        // Log and display any errors that occur during saving
        console.error("Failed to save subject prefix to storage.sync:", error);
        document.getElementById('status').textContent = "Error saving settings.";
    }
    // Remove the status message after 1.5 seconds
    setTimeout(() => document.getElementById('status').textContent = "", 1500);
});

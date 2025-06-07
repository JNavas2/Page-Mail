/*
  options.js for Page Mail Extension
  © John Navas 2025, All Rights Reserved
  Manages the options page for the extension.
*/

// Polyfill for browser/chrome compatibility
const ext = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    // Load subjectPrefix and emailService from storage
    ext.storage.sync.get(['subjectPrefix', 'emailService'], (data) => {
        document.getElementById('subjectPrefix').value = data.subjectPrefix || "";
        const service = data.emailService || "handler";
        if (service === "gmail") {
            document.getElementById('serviceGmail').checked = true;
        } else if (service === "outlook") {
            document.getElementById('serviceOutlook').checked = true;
        } else if (service === "handler") {
            document.getElementById('serviceHandler').checked = true;
        }
    });

    document.getElementById('save').addEventListener('click', () => {
        let prefix = document.getElementById('subjectPrefix').value;
        let service = document.getElementById('serviceGmail').checked
            ? "gmail"
            : document.getElementById('serviceOutlook').checked
                ? "outlook"
                : document.getElementById('serviceHandler').checked
                    ? "handler"
                    : "gmail";
        ext.storage.sync.set({ subjectPrefix: prefix, emailService: service }, () => {
            if (ext.runtime && ext.runtime.lastError) {
                console.error("Failed to save options to storage.sync:", ext.runtime.lastError);
                document.getElementById('status').textContent = "Error saving settings.";
            } else {
                document.getElementById('status').textContent = "Saved!";
            }
            setTimeout(() => {
                document.getElementById('status').textContent = "";
            }, 1500);
        });
    });
});

/*
  options.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  Manages the options page for the extension.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Load subjectPrefix and emailService from storage
    browser.storage.sync.get(['subjectPrefix', 'emailService']).then((data) => {
        document.getElementById('subjectPrefix').value = data.subjectPrefix || "";
        const service = data.emailService || "gmail";
        if (service === "gmail") {
            document.getElementById('serviceGmail').checked = true;
        } else if (service === "outlook") {
            document.getElementById('serviceOutlook').checked = true;
        } else if (service === "handler") {
            document.getElementById('serviceHandler').checked = true;
        }
    }).catch(error => {
        console.error("Failed to load options from storage.sync:", error);
        document.getElementById('status').textContent = "Error loading settings.";
    });

    document.getElementById('save').addEventListener('click', async () => {
        let prefix = document.getElementById('subjectPrefix').value;
        let service = document.getElementById('serviceGmail').checked
            ? "gmail"
            : document.getElementById('serviceOutlook').checked
                ? "outlook"
                : document.getElementById('serviceHandler').checked
                    ? "handler"
                    : "gmail";
        try {
            await browser.storage.sync.set({ subjectPrefix: prefix, emailService: service });
            document.getElementById('status').textContent = "Saved!";
        } catch (error) {
            console.error("Failed to save options to storage.sync:", error);
            document.getElementById('status').textContent = "Error saving settings.";
        }
        setTimeout(() => {
            document.getElementById('status').textContent = "";
        }, 1500);
    });
});

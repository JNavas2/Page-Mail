/*
  options.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  Manages the options page for the extension.
*/

function getStorage() {
    // Use storage.sync if available, otherwise storage.local
    return (browser.storage && browser.storage.sync) ? browser.storage.sync : browser.storage.local;
}

// Helper to show error.html in a popup window
function showErrorPopup() {
    browser.windows.create({
        url: browser.runtime.getURL("error.html"),
        type: "popup",
        width: 540,
        height: 270
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const storage = getStorage();

    // --- Android-only: disable Gmail and Outlook radio buttons ---
    if (/Android/i.test(navigator.userAgent)) {
        document.getElementById('serviceGmail').disabled = true;
        document.getElementById('serviceOutlook').disabled = true;
        // Optionally, gray out the labels for clarity
        document.querySelector('label[for="serviceGmail"]').style.color = "#aaa";
        document.querySelector('label[for="serviceOutlook"]').style.color = "#aaa";
    }

    // Load subjectPrefix and emailService from storage
    storage.get(['subjectPrefix', 'emailService']).then((data) => {
        document.getElementById('subjectPrefix').value = data.subjectPrefix || "";
        const service = data.emailService || "handler";

        // If on Android, always select handler
        if (/Android/i.test(navigator.userAgent)) {
            document.getElementById('serviceHandler').checked = true;
        } else {
            document.getElementById('serviceHandler').checked = (service === "handler");
            document.getElementById('serviceGmail').checked = (service === "gmail");
            document.getElementById('serviceOutlook').checked = (service === "outlook");
        }
    }).catch(error => {
        console.error("Failed to load options from storage:", error);
        // Show error popup
        showErrorPopup();
    });

    document.getElementById('save').addEventListener('click', async () => {
        let prefix = document.getElementById('subjectPrefix').value;
        let service;
        if (/Android/i.test(navigator.userAgent)) {
            service = "handler";
        } else {
            service = document.getElementById('serviceHandler').checked
                ? "handler"
                : document.getElementById('serviceGmail').checked
                    ? "gmail"
                    : "outlook";
        }
        try {
            await storage.set({ subjectPrefix: prefix, emailService: service });
            document.getElementById('status').textContent = "Saved!";
        } catch (error) {
            console.error("Failed to save options to storage:", error);
            // Show error popup
            showErrorPopup();
        }
        setTimeout(() => {
            document.getElementById('status').textContent = "";
        }, 1500);
    });
});

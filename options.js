/*
  options.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  Manages the options page for the extension.
*/

document.addEventListener('DOMContentLoaded', () => {
    browser.storage.sync.get('subjectPrefix').then(({ subjectPrefix }) => {
        document.getElementById('subjectPrefix').value = subjectPrefix || "";
    }).catch(error => {
        console.error("Failed to load subject prefix from storage.sync:", error);
        document.getElementById('status').textContent = "Error loading settings.";
    });

    document.getElementById('save').addEventListener('click', async () => {
        let prefix = document.getElementById('subjectPrefix').value;
        try {
            await browser.storage.sync.set({ subjectPrefix: prefix });
            document.getElementById('status').textContent = "Saved!";
        } catch (error) {
            console.error("Failed to save subject prefix to storage.sync:", error);
            document.getElementById('status').textContent = "Error saving settings.";
        }
        setTimeout(() => {
            document.getElementById('status').textContent = "";
        }, 1500);
    });
});

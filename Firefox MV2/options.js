// options.js for Page Mail Extension
// © John Navas 2025, All Rights Reserved

const ext = typeof browser !== "undefined" ? browser : chrome;

// Use storage.sync if available, else storage.local
function getStorage() {
    return (ext.storage && ext.storage.sync) ? ext.storage.sync : ext.storage.local;
}

// Show error.html in a popup window (optional, as in old version)
function showErrorPopup() {
    if (ext.windows && ext.runtime && ext.runtime.getURL) {
        ext.windows.create({
            url: ext.runtime.getURL("error.html"),
            type: "popup",
            width: 540,
            height: 270
        });
    }
}

// Platform check for Android
const isAndroid = /Android/i.test(navigator.userAgent);

function restoreOptions() {
    const storage = getStorage();
    storage.get(
        ['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine'],
        data => {
            document.getElementById('subjectPrefix').value = data.subjectPrefix || "";
            // Platform-specific logic
            let service = data.emailService || 'mailto';
            if (isAndroid) {
                service = 'mailto';
                // Disable Gmail/Outlook radios
                document.querySelector('input[name="emailService"][value="gmail"]').disabled = true;
                document.querySelector('input[name="emailService"][value="outlook"]').disabled = true;
                // Gray out labels
                document.querySelectorAll('input[name="emailService"]').forEach(input => {
                    if (input.value === 'gmail' || input.value === 'outlook') {
                        input.parentElement.style.color = "#aaa";
                    }
                });
            }
            (document.querySelector(`input[name="emailService"][value="${service}"]`) || {}).checked = true;
            (document.querySelector(`input[name="selectedTextPos"][value="${data.selectedTextPos || 'above'}"]`) || {}).checked = true;
            document.getElementById('blankLine').checked = !!data.blankLine;
        }
    );
}

document.querySelector('form.container').addEventListener('submit', function (e) {
    e.preventDefault();
    const storage = getStorage();
    let service = document.querySelector('input[name="emailService"]:checked').value;
    if (isAndroid) service = 'mailto'; // Force mailto on Android
    storage.set({
        subjectPrefix: document.getElementById('subjectPrefix').value,
        emailService: service,
        selectedTextPos: document.querySelector('input[name="selectedTextPos"]:checked').value,
        blankLine: document.getElementById('blankLine').checked
    }, function () {
        const status = document.getElementById('statusField');
        if (ext.runtime && ext.runtime.lastError) {
            status.textContent = "Error saving settings.";
            showErrorPopup();
        } else {
            status.textContent = "Saved!";
        }
        status.classList.add('has-status');
        setTimeout(() => { status.textContent = ""; status.classList.remove('has-status'); }, 1500);
    });
});

// Open help page when Help button is clicked
document.getElementById('helpBtn').addEventListener('click', function () {
    window.open('https://github.com/JNavas2/Page-Mail', '_blank', 'noopener');
});

// Initialize options on load
restoreOptions();

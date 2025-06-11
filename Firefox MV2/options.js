// options.js for Page Mail Extension
// © John Navas 2025, All Rights Reserved

const ext = typeof browser !== "undefined" ? browser : chrome;

// Restore options on page load
function restoreOptions() {
    ext.storage.sync.get(
        ['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine'],
        data => {
            document.getElementById('subjectPrefix').value = data.subjectPrefix || "";
            (document.querySelector(`input[name="emailService"][value="${data.emailService || 'mailto'}"]`) || {}).checked = true;
            (document.querySelector(`input[name="selectedTextPos"][value="${data.selectedTextPos || 'above'}"]`) || {}).checked = true;
            document.getElementById('blankLine').checked = !!data.blankLine;
        }
    );
}

// Save options when the form is submitted
document.querySelector('form.container').addEventListener('submit', function(e) {
    e.preventDefault();
    ext.storage.sync.set({
        subjectPrefix: document.getElementById('subjectPrefix').value,
        emailService: document.querySelector('input[name="emailService"]:checked').value,
        selectedTextPos: document.querySelector('input[name="selectedTextPos"]:checked').value,
        blankLine: document.getElementById('blankLine').checked
    }, function() {
        const status = document.getElementById('statusField');
        status.textContent = ext.runtime && ext.runtime.lastError ? "Error saving settings." : "Saved!";
        status.classList.add('has-status');
        setTimeout(() => { status.textContent = ""; status.classList.remove('has-status'); }, 1500);
    });
});

// Open help page when Help button is clicked
document.getElementById('helpBtn').addEventListener('click', function() {
    window.open('https://github.com/JNavas2/Page-Mail', '_blank', 'noopener');
});

// Initialize options on load
restoreOptions();

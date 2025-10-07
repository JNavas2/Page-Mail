// options.js for Page Mail Extension
// © John Navas 2025, All Rights Reserved

const ext = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    ext.storage.sync.get(
        ['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine'],
        data => {
            document.getElementById('subjectPrefix').value = data.subjectPrefix || "";

            let service = data.emailService;
            // Coalesce old values to the new single 'mailto' option for backward compatibility.
            if (service === 'mailto_web' || service === 'mailto_app') {
                service = 'mailto';
            }
            // Set the checked state for the email service radio button.
            (document.querySelector(`input[name="emailService"][value="${service || 'mailto'}"]`) || {}).checked = true;

            (document.querySelector(`input[name="selectedTextPos"][value="${data.selectedTextPos || 'above'}"]`) || {}).checked = true;
            document.getElementById('blankLine').checked = !!data.blankLine;
        }
    );

    document.querySelector('form.container').addEventListener('submit', e => {
        e.preventDefault();
        ext.storage.sync.set({
            subjectPrefix: document.getElementById('subjectPrefix').value,
            emailService: document.querySelector('input[name="emailService"]:checked').value,
            selectedTextPos: document.querySelector('input[name="selectedTextPos"]:checked').value,
            blankLine: document.getElementById('blankLine').checked
        }, () => {
            const status = document.getElementById('statusField');
            status.textContent = ext.runtime && ext.runtime.lastError ? "Error saving settings." : "Saved!";
            status.classList.add('has-status');
            setTimeout(() => {
                status.textContent = "";
                status.classList.remove('has-status');
            }, 1500);
        });
    });

    document.getElementById('helpBtn').onclick = function () {
        window.open('https://github.com/JNavas2/Page-Mail', '_blank', 'noopener');
    };
});
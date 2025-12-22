// options.js for Page Mail Extension
// © John Navas 2025, All Rights Reserved

const ext = typeof browser !== "undefined" ? browser : chrome;

function getStorage() {
    return (ext.storage && ext.storage.sync) ? ext.storage.sync : ext.storage.local;
}

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

const isAndroid = /Android/i.test(navigator.userAgent);

function restoreOptions() {
    const storage = getStorage();
    storage.get(
        ['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine'],
        data => {
            document.getElementById('subjectPrefix').value = data.subjectPrefix || "";

            // Migration: Convert legacy 'handler' value to 'mailto'
            let service = data.emailService || 'mailto';
            if (service === 'handler') service = 'mailto';

            if (isAndroid) {
                service = 'mailto';
                document.querySelector('input[name="emailService"][value="gmail"]').disabled = true;
                document.querySelector('input[name="emailService"][value="outlook"]').disabled = true;
                document.querySelectorAll('input[name="emailService"]').forEach(input => {
                    if (input.value === 'gmail' || input.value === 'outlook') {
                        input.parentElement.style.color = "#aaa";
                    }
                });
            }

            const serviceRadio = document.querySelector(`input[name="emailService"][value="${service}"]`);
            if (serviceRadio) serviceRadio.checked = true;

            const posRadio = document.querySelector(`input[name="selectedTextPos"][value="${data.selectedTextPos || 'above'}"]`);
            if (posRadio) posRadio.checked = true;

            document.getElementById('blankLine').checked = !!data.blankLine;
        }
    );
}

document.querySelector('form.container').addEventListener('submit', function (e) {
    e.preventDefault();
    const storage = getStorage();
    let service = document.querySelector('input[name="emailService"]:checked').value;
    if (isAndroid) service = 'mailto';
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

document.getElementById('helpBtn').addEventListener('click', function () {
    window.open('https://github.com/JNavas2/Page-Mail', '_blank', 'noopener');
});

restoreOptions();
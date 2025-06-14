// onboarding.js for Page Mail Extension
// © John Navas 2025, All Rights Reserved

// Polyfill for browser/chrome compatibility
const ext = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    // --- Android-specific UI fix ---
    if (/Android/i.test(navigator.userAgent)) {
        var optionsBtn = document.getElementById('options');
        if (optionsBtn) optionsBtn.style.display = 'none';
        var androidNote = document.getElementById('android-options-note');
        if (androidNote) androidNote.style.display = 'block';
    }
    // --- end Android fix ---

    // Options button
    var optionsBtn = document.getElementById('options');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            ext.runtime.openOptionsPage();
        });
    }

    // Remove Extension button
    var removeBtn = document.getElementById('remove');
    if (removeBtn && ext.management && ext.management.uninstallSelf) {
        removeBtn.addEventListener('click', () => {
            ext.management.uninstallSelf();
        });
    } else if (removeBtn) {
        // Hide Remove button if management API is unavailable
        removeBtn.style.display = "none";
    }
});

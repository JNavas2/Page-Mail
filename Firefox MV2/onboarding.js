/*
  onboarding.js
  © John Navas 2025, All Rights Reserved
*/

// Polyfill for browser/chrome compatibility
const ext = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    const optionsBtn = document.getElementById('options');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            ext.runtime.openOptionsPage();
        });
    }

    const removeBtn = document.getElementById('remove');
    if (removeBtn && ext.management && ext.management.uninstallSelf) {
        removeBtn.addEventListener('click', () => {
            ext.management.uninstallSelf();
        });
    } else if (removeBtn) {
        // Hide Remove button if management API is unavailable
        removeBtn.style.display = "none";
    }
});

/*
  onboarding.js
  © John Navas 2025, All Rights Reserved
*/

document.addEventListener('DOMContentLoaded', () => {
    const optionsBtn = document.getElementById('options');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            browser.runtime.openOptionsPage();
        });
    }

    const removeBtn = document.getElementById('remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            browser.management.uninstallSelf();
        });
    }
});

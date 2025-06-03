/*
  onboarding.js
  © John Navas 2025, All Rights Reserved
  Handles onboarding actions for the "Send by Gmail" Firefox extension.
  - Opens the options page when the "Options" button is clicked.
  - Uninstalls the extension when the "Remove Extension" button is clicked.
*/

// Add click event listener to the "Options" button
document.getElementById('options').addEventListener('click', () => {
    // Open the extension's options page
    browser.runtime.openOptionsPage();
});

// Add click event listener to the "Remove Extension" button
document.getElementById('remove').addEventListener('click', () => {
    // Uninstall (remove) the extension from Firefox
    browser.management.uninstallSelf();
});

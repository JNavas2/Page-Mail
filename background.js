/*
  background.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  - Opens Gmail® or Outlook® compose directly from toolbar button or keyboard shortcut.
  - Onboarding/upboarding opens in a new tab.
  - Shows a notification if compose fails to open.
*/

// Core function to open the selected email service's compose window
async function openComposeWindow() {
    try {
        // Get the active tab in the current window
        let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        // Get selected text from the active tab
        let [selectedText] = await browser.tabs.executeScript(tab.id, {
            code: "window.getSelection().toString();"
        });

        // Get subject prefix and email service from storage
        let { subjectPrefix, emailService } = await browser.storage.sync.get(['subjectPrefix', 'emailService']);
        subjectPrefix = subjectPrefix || "";
        emailService = emailService || "gmail";

        // Build subject and body for the email
        let subject = `${subjectPrefix}${tab.title}`;
        let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

        let composeUrl;
        if (emailService === "outlook") {
            // Outlook® compose URL
            // See: https://learn.microsoft.com/en-us/outlook/actionable-messages/compose-action
            composeUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            // Gmail® compose URL (default)
            composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        // Open the compose window in a new popup window
        await browser.windows.create({
            url: composeUrl,
            type: "popup",
            width: 800,
            height: 600
        });
    } catch (error) {
        console.error("Page Mail: Failed to open compose window:", error);
        // Show a browser notification to the user
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.runtime.getURL("images/icon-64.png"),
            "title": "Page Mail",
            "message": "Could not open compose window for Gmail® or Outlook®.\n" + (error && error.message ? error.message : "")
        });
    }
}

// Listen for toolbar button clicks
browser.browserAction.onClicked.addListener(openComposeWindow);

// Listen for keyboard shortcut commands
browser.commands.onCommand.addListener((command) => {
    if (command === "open-page-mail-popup") {
        openComposeWindow();
    }
});

// Onboarding and Upboarding: show onboarding page in a new tab on both install and update
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        browser.tabs.create({
            url: browser.runtime.getURL("onboarding.html")
        });
    }
});

/*
  background.js for Send by Gmail Firefox Extension
  © John Navas 2025, All Rights Reserved
  - Opens Gmail compose directly from toolbar button or keyboard shortcut.
  - Onboarding/upboarding opens in a new tab.
  - Shows a notification if Gmail compose fails to open.
*/

// Core function to open Gmail compose window
async function openGmailCompose() {
    try {
        // Get the active tab in the current window
        let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        // Get selected text from the active tab
        let [selectedText] = await browser.tabs.executeScript(tab.id, {
            code: "window.getSelection().toString();"
        });

        // Get subject prefix from storage (if any)
        let { subjectPrefix } = await browser.storage.sync.get('subjectPrefix');
        subjectPrefix = subjectPrefix || "";

        // Build subject and body for the email
        let subject = `${subjectPrefix}${tab.title}`;
        let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

        // Build the Gmail compose URL
        let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open Gmail compose in a new popup window
        await browser.windows.create({
            url: gmailUrl,
            type: "popup",
            width: 800,
            height: 600
        });
    } catch (error) {
        console.error("Send by Gmail: Failed to open Gmail compose window:", error);
        // Show a browser notification to the user
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.runtime.getURL("images/icon-64.png"),
            "title": "Send by Gmail",
            "message": "Could not open Gmail compose window.\n" + (error && error.message ? error.message : "")
        });
    }
}

// Listen for toolbar button clicks
browser.browserAction.onClicked.addListener(openGmailCompose);

// Listen for keyboard shortcut commands
browser.commands.onCommand.addListener((command) => {
    if (command === "open-send-by-gmail-popup") {
        openGmailCompose();
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

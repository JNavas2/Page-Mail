/*
  background.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  - Opens Gmail®, Outlook®, or the default email link handler (mailto:) compose directly from toolbar button or keyboard shortcut.
  - Onboarding/upboarding opens in a new tab.
  - Shows a popup error message if compose fails to open or if the page is protected.
*/

// Core function to open the selected email service's compose window
async function openComposeWindow() {
    try {
        // Get the active tab in the current window
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        // Try to get selected text from the active tab
        let selectedText;
        try {
            [selectedText] = await browser.tabs.executeScript(tab.id, {
                code: "window.getSelection().toString();"
            });
        } catch (injectErr) {
            // This happens on protected pages; show error popup
            await browser.windows.create({
                url: browser.runtime.getURL("error.html"),
                type: "popup",
                width: 540,
                height: 270
            });
            return;
        }

        // Get subject prefix and email service from storage
        const { subjectPrefix, emailService } = await browser.storage.sync.get(['subjectPrefix', 'emailService']);
        const prefix = subjectPrefix || "";
        const service = emailService || "gmail";

        // Build subject and body for the email
        const subject = `${prefix}${tab.title}`;
        const body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

        // Build the compose URL for the selected service
        let composeUrl;
        if (service === "outlook") {
            composeUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else if (service === "handler") {
            composeUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
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
        // Show a popup window with an error explanation
        await browser.windows.create({
            url: browser.runtime.getURL("error.html"),
            type: "popup",
            width: 400,
            height: 320
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

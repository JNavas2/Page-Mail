/*
  service_worker.js for Page Mail Extension (MV3)
  © John Navas 2025, All Rights Reserved
  Handles background actions, including opening compose windows with user options.
*/

// Use browser if available, otherwise chrome
const ext = typeof browser !== "undefined" ? browser : chrome;

// Core function to open the selected email service's compose window
async function openComposeWindow() {
    try {
        // Get the active tab in the current window
        const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        // Try to get selected text from the active tab using scripting API
        let selectedText = "";
        try {
            const results = await ext.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection().toString()
            });
            if (results && results[0] && results[0].result) {
                selectedText = results[0].result;
            }
        } catch (injectErr) {
            // This happens on protected pages; show error popup
            await ext.windows.create({
                url: ext.runtime.getURL("error.html"),
                type: "popup",
                width: 540,
                height: 270
            });
            return;
        }

        // Get all user options from storage (linkFormat removed)
        const data = await new Promise((resolve, reject) => {
            ext.storage.sync.get(
                ['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine'],
                (result) => {
                    if (ext.runtime && ext.runtime.lastError) {
                        reject(ext.runtime.lastError);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
        const prefix = data.subjectPrefix || "";
        const service = data.emailService || "mailto";
        const selectedTextPos = data.selectedTextPos || "above";
        const blankLine = !!data.blankLine;

        // Always use the plain URL as the link
        let link = tab.url;

        // Compose the email body
        let body = "";
        if (selectedText && selectedText.trim()) {
            if (selectedTextPos === "above") {
                body = selectedText + (blankLine ? "\n\n" : "\n") + link;
            } else {
                body = link + (blankLine ? "\n\n" : "\n") + selectedText;
            }
        } else {
            body = link;
        }

        // Compose the subject
        const subject = `${prefix}${tab.title}`;

        // Build the compose URL for the selected service
        let composeUrl;
        if (service === "outlook") {
            composeUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else if (service === "mailto") {
            composeUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            // Gmail
            composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        // Open the compose window in a new popup window
        await ext.windows.create({
            url: composeUrl,
            type: "popup",
            width: 800,
            height: 600
        });
    } catch (error) {
        console.error("Page Mail: Failed to open compose window:", error);
        // Show a popup window with an error explanation
        await ext.windows.create({
            url: ext.runtime.getURL("error.html"),
            type: "popup",
            width: 400,
            height: 320
        });
    }
}

// Listen for toolbar button clicks
ext.action.onClicked.addListener(openComposeWindow);

// Listen for keyboard shortcut commands
ext.commands.onCommand.addListener((command) => {
    if (command === "open-page-mail-popup") {
        openComposeWindow();
    }
});

// Onboarding and Upboarding: show onboarding page in a new tab on both install and update
ext.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        ext.tabs.create({
            url: ext.runtime.getURL("onboarding.html")
        });
    }
});

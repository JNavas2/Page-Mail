/*
  background.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
  - Cross-platform: Android uses mailto:, desktop supports Gmail/Outlook web compose.
*/

// Compose URL templates
const MAILTO_TEMPLATE = "mailto:?subject={SUBJECT}&body={BODY}";
const GMAIL_TEMPLATE = "https://mail.google.com/mail/?view=cm&fs=1&su={SUBJECT}&body={BODY}";
const OUTLOOK_TEMPLATE = "https://outlook.live.com/mail/0/deeplink/compose?subject={SUBJECT}&body={BODY}";

// Popup window sizes (desktop)
const POPUP_WIDTH = 800;
const POPUP_HEIGHT = 600;
const ERROR_POPUP_WIDTH = 540;
const ERROR_POPUP_HEIGHT = 270;

// Platform detection
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

/**
 * Returns the compose URL for the selected email service.
 * @param {string} emailService - "handler", "gmail", or "outlook"
 * @param {string} subject
 * @param {string} body
 * @returns {string} - The URL to open
 */
function getComposeUrl(emailService, subject, body) {
    const subjectEncoded = encodeURIComponent(subject);
    const bodyEncoded = encodeURIComponent(body);

    switch (emailService) {
        case "outlook":
            return OUTLOOK_TEMPLATE
                .replace("{SUBJECT}", subjectEncoded)
                .replace("{BODY}", bodyEncoded);
        case "gmail":
            return GMAIL_TEMPLATE
                .replace("{SUBJECT}", subjectEncoded)
                .replace("{BODY}", bodyEncoded);
        default: // "handler" or fallback
            return MAILTO_TEMPLATE
                .replace("{SUBJECT}", subjectEncoded)
                .replace("{BODY}", bodyEncoded);
    }
}

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
        emailService = emailService || "handler";

        // Build subject and body for the email
        let subject = `${subjectPrefix}${tab.title}`;
        let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

        // --- Android: use window.open for all services ---
        if (isAndroid()) {
            let composeUrl = getComposeUrl(emailService, subject, body);
            await browser.tabs.executeScript(tab.id, {
                code: `window.open(${JSON.stringify(composeUrl)});`
            });
            return;
        }

        // --- Desktop: use selected service ---
        let composeUrl = getComposeUrl(emailService, subject, body);

        if (emailService === "handler") {
            // Open mailto: link in a new tab
            await browser.tabs.create({ url: composeUrl });
        } else {
            // Open Gmail/Outlook compose in a popup window
            await browser.windows.create({
                url: composeUrl,
                type: "popup",
                width: POPUP_WIDTH,
                height: POPUP_HEIGHT
            });
        }
    } catch (error) {
        console.error("Page Mail: Failed to open compose window:", error);
        // Error handling: only show error popup on desktop
        try {
            if (!isAndroid()) {
                await browser.windows.create({
                    url: browser.runtime.getURL("error.html"),
                    type: "popup",
                    width: ERROR_POPUP_WIDTH,
                    height: ERROR_POPUP_HEIGHT
                });
            }
        } catch (popupError) {
            // Fallback: show a browser notification if popup fails
            browser.notifications.create({
                "type": "basic",
                "iconUrl": browser.runtime.getURL("images/icon-64.png"),
                "title": "Page Mail",
                "message": "Could not open error popup.\n" +
                    (error && error.message ? error.message : "") +
                    (popupError && popupError.message ? "\n(Popup error: " + popupError.message + ")" : "")
            });
        }
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

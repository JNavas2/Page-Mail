/*
  background.js for Page Mail Firefox Extension
  © John Navas 2025, All Rights Reserved
*/

const MAILTO_TEMPLATE = "mailto:?subject={SUBJECT}&body={BODY}";
const GMAIL_TEMPLATE = "https://mail.google.com/mail/?view=cm&fs=1&su={SUBJECT}&body={BODY}";
const OUTLOOK_TEMPLATE = "https://outlook.live.com/mail/0/deeplink/compose?subject={SUBJECT}&body={BODY}";

const POPUP_WIDTH = 800;
const POPUP_HEIGHT = 600;
const ERROR_POPUP_WIDTH = 540;
const ERROR_POPUP_HEIGHT = 270;

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        browser.tabs.create({
            url: browser.runtime.getURL("onboarding.html")
        });
    }
});

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function getComposeUrl(emailService, subject, body) {
    const subjectEncoded = encodeURIComponent(subject);
    const bodyEncoded = encodeURIComponent(body);

    switch (emailService) {
        case "outlook":
            return OUTLOOK_TEMPLATE.replace("{SUBJECT}", subjectEncoded).replace("{BODY}", bodyEncoded);
        case "gmail":
            return GMAIL_TEMPLATE.replace("{SUBJECT}", subjectEncoded).replace("{BODY}", bodyEncoded);
        default:
            return MAILTO_TEMPLATE.replace("{SUBJECT}", subjectEncoded).replace("{BODY}", bodyEncoded);
    }
}

async function openComposeWindow() {
    try {
        let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        let [selectedText] = await browser.tabs.executeScript(tab.id, {
            code: "window.getSelection().toString();"
        });

        let { subjectPrefix, emailService, selectedTextPos, blankLine } =
            await browser.storage.sync.get(['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine']);

        subjectPrefix = subjectPrefix || "";
        // Match value in options.html
        emailService = emailService || "mailto";
        selectedTextPos = selectedTextPos || "above";
        blankLine = !!blankLine;

        let link = tab.url;
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

        let subject = `${subjectPrefix}${tab.title}`;
        let composeUrl = getComposeUrl(emailService, subject, body);

        if (isAndroid()) {
            await browser.tabs.executeScript(tab.id, {
                code: `window.open(${JSON.stringify(composeUrl)});`
            });
            return;
        }

        // --- FIXED LOGIC BLOCK ---
        // Handle both standard "mailto" and any legacy "handler" settings
        if (emailService === "mailto" || emailService === "handler") {
            // FIX: Use update instead of windows.create
            // This triggers Thunderbird without leaving a blank window behind.
            await browser.tabs.update(tab.id, { url: composeUrl });
        } else {
            // Gmail and Outlook still require a new window for the web UI
            await browser.windows.create({
                url: composeUrl,
                type: "popup",
                width: POPUP_WIDTH,
                height: POPUP_HEIGHT
            });
        }
    } catch (error) {
        console.error("Page Mail Error:", error);
        if (!isAndroid()) {
            await browser.windows.create({
                url: browser.runtime.getURL("error.html"),
                type: "popup",
                width: ERROR_POPUP_WIDTH,
                height: ERROR_POPUP_HEIGHT
            });
        }
    }
}

browser.browserAction.onClicked.addListener(openComposeWindow);
browser.commands.onCommand.addListener((command) => {
    if (command === "open-page-mail-popup") openComposeWindow();
});
/*
  service_worker.js for Page Mail Extension (MV3)
  © John Navas 2025, All Rights Reserved
  Handles background actions, including opening compose windows with user options.
*/

const ext = typeof browser !== "undefined" ? browser : chrome;
const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

// A helper function to find if an offscreen document is already open
async function hasOffscreenDocument() {
    const contexts = await ext.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [ext.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
    });
    return contexts.length > 0;
}

// A helper function to create and use the offscreen document
async function openMailtoInOffscreen(mailtoUrl) {
    if (await hasOffscreenDocument()) {
        await ext.offscreen.closeDocument();
    }
    
    await ext.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH + '#' + encodeURIComponent(mailtoUrl),
        reasons: ['CLIPBOARD'], // CORRECTED REASON
        justification: 'To reliably open mailto: links from a service worker.',
    });
}

// Core function to open the selected email service's compose window
async function openComposeWindow() {
    try {
        const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        let selectedText = "";
        try {
            const results = await ext.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection().toString()
            });
            if (results && results[0] && results[0].result) {
                selectedText = results[0].result;
            }
        } catch {
            await ext.windows.create({
                url: ext.runtime.getURL("error.html"),
                type: "popup",
                width: 540,
                height: 270
            });
            return;
        }

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

        const subject = `${prefix}${tab.title}`;

        // Compose URL construction
        let composeUrl;
        if (service === "outlook") {
            composeUrl = `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else if (service === "mailto") {
            composeUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
            // Gmail is the default
            composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        // Opening compose window logic
        if (service === "gmail" || service === "outlook") {
            await ext.windows.create({
                url: composeUrl,
                type: "popup",
                width: 800,
                height: 600
            });
        } else { // Covers "mailto"
            await openMailtoInOffscreen(composeUrl);
        }
    } catch (error) {
        console.error("Page Mail: Failed to open compose window:", error);
        await ext.windows.create({
            url: ext.runtime.getURL("error.html"),
            type: "popup",
            width: 400,
            height: 320
        });
    }
}

ext.action.onClicked.addListener(openComposeWindow);
ext.commands.onCommand.addListener((command) => {
    if (command === "open-page-mail-popup") {
        openComposeWindow();
    }
});
ext.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        ext.tabs.create({
            url: ext.runtime.getURL("onboarding.html")
        });
    }
});
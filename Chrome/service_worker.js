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

// A helper function to create and use the offscreen document for mailto: links
async function openMailtoInOffscreen(mailtoUrl) {
    if (await hasOffscreenDocument()) {
        await ext.offscreen.closeDocument();
    }
    
    // Uses the CLIPBOARD reason as it is the most appropriate for triggering external actions
    await ext.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH + '#' + encodeURIComponent(mailtoUrl),
        reasons: ['CLIPBOARD'], 
        justification: 'To reliably open mailto: links from a service worker without leaving a blank window.',
    });
}

// Core function to open the selected email service's compose window
async function openComposeWindow() {
    try {
        const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
        if (!tab) throw new Error("No active tab found.");

        let selectedText = "";
        try {
            // Attempt to get selected text from the page
            const results = await ext.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection().toString()
            });
            if (results && results[0] && results[0].result) {
                selectedText = results[0].result;
            }
        } catch {
            // If the script fails (e.g., on restricted chrome:// pages), 
            // open the error page in a full tab for better reliability on Windows 11.
            await ext.tabs.create({
                url: ext.runtime.getURL("error.html")
            });
            return;
        }

        // Retrieve user preferences from storage
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
        const service = data.emailService || "mailto"; // Matches options.html values
        const selectedTextPos = data.selectedTextPos || "above";
        const blankLine = !!data.blankLine;

        let link = tab.url;
        let body = "";
        
        // Construct email body based on selection and placement settings
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
            // Gmail is the fallback service
            composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        // Execution logic: Web-based vs System-based
        if (service === "gmail" || service === "outlook") {
            // Webmail requires a popup window
            await ext.windows.create({
                url: composeUrl,
                type: "popup",
                width: 800,
                height: 600
            });
        } else { 
            // mailto: uses the offscreen document to prevent the "empty window" bug
            await openMailtoInOffscreen(composeUrl);
        }
    } catch (error) {
        console.error("Page Mail: Failed to open compose window:", error);
        await ext.tabs.create({
            url: ext.runtime.getURL("error.html")
        });
    }
}

// Event Listeners
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
/*
  service_worker.js for Page Mail Extension (MV3)
  © John Navas 2025, All Rights Reserved
  Handles background actions, including opening compose windows with user options.
*/

console.log("Page Mail Service Worker starting up...");

const ext = typeof browser !== "undefined" ? browser : chrome;

/**
 * Core function to open the selected email service's compose window.
 * Uses script injection for mailto: to ensure compatibility with Windows 11.
 */
async function openComposeWindow() {
    console.log("Toolbar button clicked - initializing Page Mail...");
    try {
        const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            console.error("No active tab found.");
            return;
        }

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
        } catch (e) {
            // If the script fails (e.g., on restricted pages), show the error page
            console.warn("Scripting blocked on this page. Opening error page.", e);
            await ext.tabs.create({ url: ext.runtime.getURL("error.html") });
            return;
        }

        // Retrieve user preferences from storage
        const data = await ext.storage.sync.get(['subjectPrefix', 'emailService', 'selectedTextPos', 'blankLine']);

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
            composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        // Execution logic
        if (service === "gmail" || service === "outlook") {
            // Webmail requires a popup window
            await ext.windows.create({
                url: composeUrl,
                type: "popup",
                width: 800,
                height: 600
            });
        } else {
            // FIXED: Inject the mailto trigger directly into the active tab
            // This treats the link as a user-initiated action from the page context.
            console.log("Injecting mailto trigger into active tab...");
            await ext.scripting.executeScript({
                target: { tabId: tab.id },
                func: (url) => {
                    const link = document.createElement('a');
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                args: [composeUrl]
            });
        }
    } catch (error) {
        console.error("Page Mail Error:", error);
        await ext.tabs.create({ url: ext.runtime.getURL("error.html") });
    }
}

// Event Listeners (Must be at the top level)
ext.action.onClicked.addListener(openComposeWindow);

ext.commands.onCommand.addListener((command) => {
    if (command === "open-page-mail-popup") {
        openComposeWindow();
    }
});

ext.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        ext.tabs.create({ url: ext.runtime.getURL("onboarding.html") });
    }
});
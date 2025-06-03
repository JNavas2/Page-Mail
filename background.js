/*
  background.js for Send by Gmail Firefox Extension
  © John Navas 2025, All Rights Reserved
  This script listens for the extension's keyboard shortcut (command)
  and triggers the same "Send by Gmail" functionality as the popup button.
*/

// Listen for commands (keyboard shortcuts) registered in manifest.json
browser.commands.onCommand.addListener(async (command) => {
    // Check if the triggered command is our "send-by-gmail" action
    if (command === "send-by-gmail") {
        try {
            // Get the currently active tab in the current window
            let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
            if (!tab) {
                console.error("Send by Gmail: No active tab found.");
                return;
            }

            // Execute a script in the active tab to get any selected text
            let [{ result: selectedText }] = await browser.tabs.executeScript(tab.id, {
                code: "window.getSelection().toString();"
            });

            // Retrieve the subject prefix from sync storage (set by the user in options)
            let syncResult = await browser.storage.sync.get({ subjectPrefix: "" });
            let subjectPrefix = syncResult.subjectPrefix;

            // Compose the email subject: prefix + tab title
            let subject = `${subjectPrefix}${tab.title}`;

            // Compose the email body: selected text (if any) followed by the tab URL
            let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

            // Construct the Gmail compose URL with encoded subject and body
            let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open the Gmail compose window in a new popup window
            browser.windows.create({
                url: gmailUrl,
                type: "popup",
                width: 800,
                height: 600
            });
        } catch (error) {
            // Log any errors for debugging
            console.error("Send by Gmail command failed:", error);
        }
    }
});

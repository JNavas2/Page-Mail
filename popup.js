/*
  popup.js
  "Send by Gmail" Firefox Extension
  © John Navas 2025, All Rights Reserved
*/

// Add a click event listener to the "Send by Gmail" button
document.getElementById('send-gmail').addEventListener('click', async () => {
    // Get the currently active tab in the current window
    let [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    // Get any selected text from the active tab
    let [{ result: selectedText }] = await browser.tabs.executeScript(tab.id, {
        code: "window.getSelection().toString();"
    });

    // Retrieve the subject prefix from Firefox cloud storage (sync)
    let { subjectPrefix } = await browser.storage.sync.get('subjectPrefix');
    subjectPrefix = subjectPrefix || "";

    // Compose the email subject using the prefix and the tab title
    let subject = `${subjectPrefix}${tab.title}`;

    // Compose the email body: selected text (if any) followed by the tab URL
    let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;

    // Construct the Gmail compose URL with encoded subject and body
    let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the Gmail compose window in a popup
    browser.windows.create({
        url: gmailUrl,
        type: "popup",
        width: 800,
        height: 600
    });
});

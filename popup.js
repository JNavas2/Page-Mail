/*
  popup.js
  "Send by Gmail" Firefox Extension
  © John Navas 2025, All Rights Reserved
*/

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-gmail');
    const status = document.getElementById('status');

    sendBtn.addEventListener('click', async () => {
        sendBtn.disabled = true;
        status.textContent = "Preparing email...";
        try {
            let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
            let [selectedText] = await browser.tabs.executeScript(tab.id, {
                code: "window.getSelection().toString();"
            });
            let { subjectPrefix } = await browser.storage.sync.get('subjectPrefix');
            subjectPrefix = subjectPrefix || "";
            let subject = `${subjectPrefix}${tab.title}`;
            let body = selectedText ? `${selectedText}\n\n${tab.url}` : tab.url;
            let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            await browser.windows.create({
                url: gmailUrl,
                type: "popup",
                width: 800,
                height: 600
            });
            status.textContent = "Gmail compose opened!";
            setTimeout(() => window.close(), 1000);
        } catch (error) {
            console.error("Send by Gmail (popup) failed:", error);
            status.textContent = "Error: Could not send.";
            sendBtn.disabled = false;
        }
    });
});

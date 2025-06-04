/*
  background.js for Send by Gmail Firefox Extension
  © John Navas 2025, All Rights Reserved
  Handles onboarding/upboarding and ensures both the toolbar button
  and keyboard shortcut open the message popup in a new window.
*/

// Function to open the Send by Gmail popup window
function openSendByGmailPopup() {
    browser.windows.create({
        url: browser.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 120
    });
}

// Listen for the keyboard shortcut
browser.commands.onCommand.addListener((command) => {
    if (command === "open-send-by-gmail-popup") {
        openSendByGmailPopup();
    }
});

// Listen for toolbar button clicks
browser.browserAction.onClicked.addListener(() => {
    openSendByGmailPopup();
});

// Onboarding and Upboarding: show onboarding page on both install and update
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        browser.tabs.create({ url: browser.runtime.getURL("onboarding.html") });
    }
});

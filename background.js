/*
  background.js for Send by Gmail Firefox Extension
  © John Navas 2025, All Rights Reserved
  Handles onboarding/upboarding and keyboard shortcut to open the popup.
*/

browser.commands.onCommand.addListener((command) => {
    if (command === "open-send-by-gmail-popup") {
        browser.windows.create({
            url: browser.runtime.getURL("popup.html"),
            type: "popup",
            width: 400,
            height: 120
        });
    }
});

// Onboarding and Upboarding: show onboarding page on both install and update
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        browser.tabs.create({ url: browser.runtime.getURL("onboarding.html") });
    }
});

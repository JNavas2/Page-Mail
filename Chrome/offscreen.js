// offscreen.js
// © John Navas 2025, All Rights Reserved

// This script reads the mailto link from the URL hash, opens it, and closes.
// This avoids a race condition with message passing from the service worker.
try {
    const url = new URL(location.href);
    // The mailto link is passed in the URL hash.
    // decodeURIComponent is necessary to correctly handle special characters.
    const mailtoUrl = decodeURIComponent(url.hash.substring(1));

    if (mailtoUrl && mailtoUrl.startsWith('mailto:')) {
        window.open(mailtoUrl);
    }
} catch (e) {
    console.error("Offscreen script error:", e);
} finally {
    // Close the offscreen document after the action.
    window.close();
}
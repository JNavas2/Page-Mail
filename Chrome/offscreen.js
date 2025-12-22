// offscreen.js
// © John Navas 2025, All Rights Reserved

try {
    const url = new URL(location.href);
    const mailtoUrl = decodeURIComponent(url.hash.substring(1));

    if (mailtoUrl && mailtoUrl.startsWith('mailto:')) {
        // Using location.href is more reliable for protocol handlers
        // in offscreen documents than window.open.
        location.href = mailtoUrl;
    }
} catch (e) {
    console.error("Offscreen script error:", e);
}

// Do NOT use a 'finally' block to window.close() immediately.
// Give the browser 2 seconds to hand the request to the OS.
setTimeout(() => {
    window.close();
}, 2000);
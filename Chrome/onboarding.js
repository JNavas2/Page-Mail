// onboarding.js
// © John Navas 2025, All Rights Reserved

const ext = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    const optionsBtn = document.getElementById('options');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            ext.runtime.openOptionsPage();
        });
    }

    const removeBtn = document.getElementById('remove');
    if (removeBtn && ext.management && ext.management.uninstallSelf) {
        removeBtn.addEventListener('click', () => {
            ext.management.uninstallSelf();
        });
    } else if (removeBtn) {
        removeBtn.style.display = "none";
    }

    // Load and display changes from whats_new.json
    fetch(ext.runtime.getURL("whats_new.json"))
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load what's new");
            }
            return response.json();
        })
        .then(data => {
            if (data.changes && Array.isArray(data.changes)) {
                const list = document.getElementById("whatsNewList");
                data.changes.forEach(change => {
                    const li = document.createElement("li");
                    li.textContent = change;
                    list.appendChild(li);
                });
            }
        })
        .catch(err => {
            console.warn("Could not load what's new:", err);
            const section = document.getElementById("whatsNew");
            if (section) {
                section.style.display = "none";
            }
        });
});

# Page Mail

**Send the current page by Gmail with the page title, selected text, and URL—easily.**

---

## 🚀 Overview

**Page Mail** is a simple yet powerful Firefox extension that lets you quickly compose a Gmail message containing:
- The current page’s title
- Any text you’ve selected
- The page URL

Perfect for sharing articles, research, or anything you find online—right from your browser!

---

## 🎉 Features

- **One-click sharing:** Click the extension button to open Gmail with the page details pre-filled.
- **Keyboard shortcut:** Use <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> (customizable) to open the extension popup.
- **Selected text support:** Highlight text on a page to include it in your email.
- **Custom subject prefix:** Personalize your email subject line via the options page.
- **Syncs across devices:** Your subject prefix setting is saved with your Firefox account.

---

## 🛠️ Installation

1. **From Mozilla Add-ons:**
   - Visit [Page Mail on AMO](https://addons.mozilla.org/) *(replace with your actual link)*.
   - Click **Add to Firefox**.

---

## ⚡ Usage

1. **Click the extension icon** in your toolbar to open the popup.
2. **Or use the keyboard shortcut:**  
   - Default: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>  
   - To change:  
     - Go to `about:addons` → ⚙️ (gear) → **Manage Extension Shortcuts**
   - **Note:** The shortcut opens the popup; you must click the **Page Mail** button to send the email.

3. **Optional:**  
   - Highlight text on the page before opening the popup to include it in your email.

4. **Gmail will open** in a new popup window with the subject and body pre-filled.

---

## ⚙️ Options

- Access the options page via the onboarding page (shown after install or update), or via the add-on manager (`about:addons` → **Page Mail** → **Preferences**).
- Set a **subject prefix** (e.g., “FYI: ”) to be added to every email subject.
- Your prefix is saved to Firefox’s cloud storage and syncs across devices.

---

## 🔒 Privacy & Permissions

- **No tracking. No data collection.**  
  This extension does **not** collect, store, or transmit any personal data.
- **Permissions used:**
  - `activeTab`: To access the current page’s title, URL, and selected text.
  - `storage`: To save your subject prefix (using Firefox’s `storage.sync`).
  - `management`: To allow self-uninstall from the onboarding page.
- **Open source:**  
  Review the code anytime!

---

## 🦺 Compatibility

- Firefox 70+
- Not currently available for Chrome or Edge.

---

## 📖 Known Issues & Limitations

- The extension cannot access special pages (e.g., `about:`, `addons.mozilla.org`).
- Gmail must be accessible in your browser for the popup to work.
- Only works with Gmail.
- The amount of selected text you can include is limited by the maximum URL length supported by browsers and Gmail. Extremely large selections may be truncated or fail to open in Gmail.

---

## 💡 FAQ

**Q:** Can I change the keyboard shortcut?  
**A:** Yes! Go to `about:addons` → ⚙️ → **Manage Extension Shortcuts**.

**Q:** Does this work with other email providers?  
**A:** No, it is designed for Gmail only.

**Q:** Is my browsing data sent anywhere?  
**A:** No. The extension only opens Gmail with data you see; nothing is sent to third parties.

---

## 🏷️ License

© John Navas 2025. All Rights Reserved.

---

## 📣 Support

For questions, suggestions, or bug reports, please open an issue on [GitHub](https://github.com/your-repo) *(replace with your actual link)*.

---

**Enjoy fast, private sharing with Page Mail!**

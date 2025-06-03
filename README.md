# Send by Gmail

**Send the current page by Gmail with the page title, selected text, and URL—instantly.**

---

## 🚀 Overview

**Send by Gmail** is a simple yet powerful Firefox extension that lets you quickly compose a Gmail message containing:
- The current page’s title
- Any text you’ve selected
- The page URL

Perfect for sharing articles, research, or anything you find online—right from your browser!

---

## 🎉 Features

- **One-click sharing:** Click the extension button to open Gmail with the page details pre-filled.
- **Keyboard shortcut:** Use <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> (customizable) for even faster sharing.
- **Selected text support:** Highlight text on a page to include it in your email.
- **Custom subject prefix:** Personalize your email subject line via the options page.
- **Syncs across devices:** Your subject prefix setting is saved with your Firefox account.

---

## 🛠️ Installation

1. **From Mozilla Add-ons (recommended):**
   - Visit [Send by Gmail on AMO](https://addons.mozilla.org/) *(replace with your actual link)*.
   - Click **Add to Firefox**.

2. **Manual installation (for developers):**
   - Download or clone this repository.
   - Go to `about:debugging` in Firefox.
   - Click **Load Temporary Add-on** and select the `manifest.json` file from this project.

---

## ⚡ Usage

1. **Click the extension icon** in your toolbar.
2. **Or use the keyboard shortcut:**  
   - Default: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd>  
   - To change:  
     - Go to `about:addons` → ⚙️ (gear) → **Manage Extension Shortcuts**

3. **Optional:**  
   - Highlight text on the page before triggering the extension to include it in your email.

4. **Gmail will open** in a popup window with the subject and body pre-filled.

---

## ⚙️ Options

- Click the extension icon and select **Options** (or open via the onboarding page).
- Set a **subject prefix** (e.g., “FYI: ”) to be added to every email subject.
- Your prefix is saved to Firefox’s cloud storage and syncs across devices.

---

## 🔒 Privacy & Permissions

- **No tracking. No data collection.**  
  This extension does **not** collect, store, or transmit any personal data.
- **Permissions used:**
  - `activeTab`: To access the current page’s title, URL, and selected text.
  - `storage`: To save your subject prefix (using Firefox’s `storage.sync`).
- **Open source:**  
  Review the code anytime!

---

## 🖥️ Compatibility

- Firefox 70+
- Not currently available for Chrome or Edge.

---

## 📝 Known Issues & Limitations

- The extension cannot access special pages (e.g., `about:`, `addons.mozilla.org`).
- Gmail must be accessible in your browser for the popup to work.
- Only works with Gmail.

---

## 💡 FAQ

**Q:** Can I change the keyboard shortcut?  
**A:** Yes! Go to `about:addons` → ⚙️ → **Manage Extension Shortcuts**.

**Q:** Does this work with other email providers?  
**A:** No, it is designed for Gmail only.

**Q:** Is my browsing data sent anywhere?  
**A:** No. The extension only opens Gmail with data you see; nothing is sent to third parties.

---

## 🛡️ License

© John Navas 2025. All Rights Reserved.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📫 Support

For questions, suggestions, or bug reports, please open an issue on [GitHub](https://github.com/your-repo) *(replace with your actual link)*.

---

**Enjoy fast, private sharing with Send by Gmail!**

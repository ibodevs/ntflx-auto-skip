<div align="center">
  <img alt="NTFLX Auto-Skip Logo" src="assets/images/ntlfx_logo_1200.png" width="420" />
  <p><strong>Automatically skip recaps, intros, next‑episode countdown & "Are you still watching?" on Netflix</strong></p>
</div>

# NTFLX Auto-Skip

[![Firefox Add-on](https://img.shields.io/badge/Firefox-FF7139?logo=Firefox&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/ntflx-auto-skip/)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Status: Stable](https://img.shields.io/badge/status-stable-blue)

NTFLX Auto-Skip saves you from repeatedly clicking Netflix's skip buttons so you can focus on watching. It auto-clicks recap skip, intro skip, next‑episode (removing the 5s delay) and the "Are you still watching?" confirmation. A small on‑screen message lets you know what was skipped.

> Officially published only on Firefox. Chrome users can still install it manually (see below).

## 1. Features

- [x] Skip episode recaps
- [x] Skip introductions
- [x] Instantly jump to the next episode (bypass 5s timer)
- [x] Dismiss the "Are you still watching?" dialog
- [x] Granular enable/disable for each feature (plus a master toggle)
- [x] Persists your choices across devices via browser sync storage

## 2. Installation

### 2.1 Firefox 

Just click the Firefox badge above (Add-ons Store). Once installed, open Netflix and configure the options in the extension popup.

### 2.2 Chrome (Manual install)

The extension is not (yet) on the Chrome Web Store. You can load it unpacked:
1. Download or clone this repository.
2. In the project folder, rename (or copy) `chrome.manifest.json` to `manifest.json` (overwriting the existing WebExtension v2 `manifest.json`).
3. Open Chrome and go to `chrome://extensions/`.
4. Enable Developer Mode (top-right toggle).
5. Click "Load unpacked" and select the project folder.
6. The extension should appear; pin it if you want quick access.

To update later, pull the latest changes and click the reload icon on the extension card.

## 3. Usage & Options

Click the toolbar icon to open the popup and choose what to skip:

- `All`: toggles every option at once
- `Summaries`: skips recaps
- `Introductions`: skips intros
- `Next episode`: removes the countdown delay
- `Still watching?`: auto-confirms the prompt

You may need to refresh the Netflix tab right after first installation. A brief red message overlay (bottom-right) indicates what was automatically skipped.

## 4. How It Works 

The content script watches Netflix's player container using `MutationObserver`. When relevant skip / next / continue buttons appear, it checks your saved preferences (`browser.storage.sync`) and programmatically clicks them. A lightweight message element is injected only once and reused for notifications. No external network calls are made.

## 5. Contributing

Issues and pull requests are welcome:
1. Open an issue describing a bug / enhancement.
2. Fork the repo & create a feature branch.
3. Keep changes small and focused.
4. Submit a PR referencing the issue.

Potential ideas:
- Support for additional Netflix UI variations. 
- Option to adjust notification style / duration. 
- Local only basic counters, e.g. to show how many skips were performed. 

## 6. Privacy 

No personal data is collected, stored externally, or transmitted. The extension only uses `browser.storage.sync` for four boolean flags (recap, intro, next, still). All logic runs locally in the tab.

## 7. Maintenance Status 

This project originated several years ago and is considered stable. Active new feature development is minimal, but:
- Bug reports will be looked at on a best-effort basis.
- PRs that are small, clear, and tested are likely to be merged.

## 8. License & Disclaimer 

Released under the [MIT License](LICENSE).

Not affiliated with, endorsed, or sponsored by Netflix. All trademarks are property of their respective owners.

---

### FAQ

Q: It doesn't skip anything after install.  
A: Refresh the Netflix tab so the content script loads after your preferences are saved.

Q: Does it work with Profiles / multiple devices?  
A: Yes, as long as browser sync is enabled, preferences follow you.

Q: Will it appear on the Chrome Web Store?  
A: Possibly in the future; manual install is currently the path.

---

Enjoy smoother binge-watching!

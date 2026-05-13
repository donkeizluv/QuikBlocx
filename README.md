# QuikBlocx Chrome Extension

This repository contains a minimal Chrome extension scaffold using Manifest V3.
It is currently scoped to X (`https://x.com/*`) as a personal UX companion for future shortcuts and automations.

## Included

- `manifest.json` with MV3 configuration
- `popup.html` / `popup.js` / `popup.css`
- `options.html` / `options.js` / `options.css`
- `background.js` service worker
- `content.js` content script

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder

## Notes

- Popup text is stored in `chrome.storage.sync`
- Options let you choose the page highlight color used by the content script
- The current scaffold injects the content script only on `https://x.com/*`

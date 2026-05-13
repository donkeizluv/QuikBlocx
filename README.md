# QuikBlocx Chrome Extension

This repository contains a lightweight TypeScript Chrome extension scaffold using Manifest V3.
It is scoped to X (`https://x.com/*`) as a personal UX companion for future shortcuts and automations.

## Included

- `public/manifest.json` with MV3 configuration
- `public/popup.html` / `public/popup.css`
- `public/options.html` / `public/options.css`
- `src/background.ts` service worker
- `src/content.ts` content script
- `src/popup.ts` popup logic
- `src/options.ts` options logic
- `scripts/build.mjs` for bundling and copying static assets

## Setup

1. Run `yarn install`
2. Run `yarn build`

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

## Notes

- Use `yarn watch` while developing to rebuild TypeScript on change
- Popup text is stored in `chrome.storage.sync`
- Options let you choose the page highlight color used by the content script
- The current scaffold injects the content script only on `https://x.com/*`

# QuikBlocx Chrome Extension

QuikBlocx is a lightweight TypeScript Chrome extension for X (`https://x.com/*`).
It is built as a personal UX companion for post parsing, custom injected controls, and page-level automations.

## Setup

1. Run `yarn install`
2. Run `yarn build`
3. Optional during development: run `yarn watch`

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

## Notes

- Load the built `dist` folder, not the repo root
- Rebuild and reload the extension after code changes
- The extension is currently scoped only to `https://x.com/*`
- The current block automation is intentionally strict and aborts when sanity checks do not match

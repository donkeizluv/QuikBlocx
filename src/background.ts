type Settings = {
  popupMessage: string;
  highlightColor: string;
};

const defaultSettings: Settings = {
  popupMessage: "Hello from QuikBlocx",
  highlightColor: "#b75e2b"
};

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.sync.get(Object.keys(defaultSettings));
  const missingEntries = Object.fromEntries(
    Object.entries(defaultSettings).filter(([key]) => current[key] === undefined)
  );

  if (Object.keys(missingEntries).length > 0) {
    await chrome.storage.sync.set(missingEntries);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  await chrome.tabs.sendMessage(tab.id, { type: "PING" });
});

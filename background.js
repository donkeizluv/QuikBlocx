chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    popupMessage: "Hello from QuikBlocx",
    highlightColor: "#b75e2b"
  };

  const current = await chrome.storage.sync.get(Object.keys(defaults));
  const missingEntries = Object.fromEntries(
    Object.entries(defaults).filter(([key]) => current[key] === undefined)
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

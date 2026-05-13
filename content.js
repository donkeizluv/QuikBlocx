chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "PING") {
    return;
  }

  void flashPage();
});

async function flashPage() {
  const { highlightColor = "#b75e2b" } = await chrome.storage.sync.get("highlightColor");
  const previousOutline = document.documentElement.style.outline;

  document.documentElement.style.outline = `4px solid ${highlightColor}`;

  window.setTimeout(() => {
    document.documentElement.style.outline = previousOutline;
  }, 900);
}

const colorInput = document.querySelector<HTMLInputElement>("#highlight-color");
const saveButton = document.querySelector<HTMLButtonElement>("#save-options");
const status = document.querySelector<HTMLParagraphElement>("#options-status");

if (!colorInput || !saveButton || !status) {
  throw new Error("Options UI did not load correctly.");
}

async function restoreOptions() {
  const { highlightColor = "#b75e2b" } = await chrome.storage.sync.get("highlightColor");
  colorInput.value = highlightColor;
}

async function saveOptions() {
  await chrome.storage.sync.set({ highlightColor: colorInput.value });
  status.textContent = "Settings saved.";
}

saveButton.addEventListener("click", () => {
  void saveOptions();
});

void restoreOptions();

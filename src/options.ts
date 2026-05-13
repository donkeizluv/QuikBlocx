export {};

const ui = getOptionsUi();

async function restoreOptions() {
  const { highlightColor = "#b75e2b" } = await chrome.storage.sync.get("highlightColor");
  ui.colorInput.value = highlightColor;
}

async function saveOptions() {
  await chrome.storage.sync.set({ highlightColor: ui.colorInput.value });
  ui.statusMessage.textContent = "Settings saved.";
}

ui.saveButton.addEventListener("click", () => {
  void saveOptions();
});

void restoreOptions();

function getOptionsUi() {
  const colorInput = document.querySelector<HTMLInputElement>("#highlight-color");
  const saveButton = document.querySelector<HTMLButtonElement>("#save-options");
  const statusMessage = document.querySelector<HTMLParagraphElement>("#options-status");

  if (!colorInput || !saveButton || !statusMessage) {
    throw new Error("Options UI did not load correctly.");
  }

  return {
    colorInput,
    saveButton,
    statusMessage
  };
}

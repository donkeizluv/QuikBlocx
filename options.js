const colorInput = document.querySelector("#highlight-color");
const saveButton = document.querySelector("#save-options");
const status = document.querySelector("#options-status");

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

const messageInput = document.querySelector<HTMLInputElement>("#message");
const saveButton = document.querySelector<HTMLButtonElement>("#save-button");
const status = document.querySelector<HTMLParagraphElement>("#status");

if (!messageInput || !saveButton || !status) {
  throw new Error("Popup UI did not load correctly.");
}

async function loadSavedMessage() {
  const { popupMessage = "" } = await chrome.storage.sync.get("popupMessage");
  messageInput.value = popupMessage;
}

async function saveMessage() {
  const popupMessage = messageInput.value.trim();
  await chrome.storage.sync.set({ popupMessage });
  status.textContent = popupMessage ? "Saved." : "Cleared.";
}

saveButton.addEventListener("click", () => {
  void saveMessage();
});

void loadSavedMessage();

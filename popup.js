const messageInput = document.querySelector("#message");
const saveButton = document.querySelector("#save-button");
const status = document.querySelector("#status");

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

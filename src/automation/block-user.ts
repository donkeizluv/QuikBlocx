import { getPostHandle, type XPost } from "../parser";
import { isVisible, waitForElement } from "./dom-waits";

const BLOCK_FLOW_TIMEOUT_MS = 3000;
const inFlightPosts = new WeakSet<XPost>();

type DropdownBlockMatch = {
  blockButton: HTMLElement;
  dropdown: HTMLElement;
};

export async function runBlockFlow(post: XPost) {
  if (inFlightPosts.has(post)) {
    console.info("[QuikBlocx] Block flow already running for this post.");
    return;
  }

  const targetHandle = getPostHandle(post);
  if (!targetHandle) {
    console.error(
      "[QuikBlocx] Could not resolve the target handle. Aborting block flow.",
    );
    return;
  }

  const caretButton = post.querySelector<HTMLButtonElement>(
    '[data-testid="caret"]',
  );
  if (!caretButton) {
    console.error(
      `[QuikBlocx] Caret button missing for ${targetHandle}. Aborting block flow.`,
    );
    return;
  }

  inFlightPosts.add(post);

  try {
    caretButton.click();

    const dropdownBlockMatch = await waitForElement(
      () => findDropdownNBlockButton(targetHandle),
      BLOCK_FLOW_TIMEOUT_MS,
    );

    if (!dropdownBlockMatch) {
      console.error(
        `[QuikBlocx] No matching block menu item found for ${targetHandle}.`,
      );
      return;
    }

    const { blockButton } = dropdownBlockMatch;
    blockButton.click();

    const confirmationDialog = await waitForElement(
      () => findConfirmationDialog(targetHandle),
      BLOCK_FLOW_TIMEOUT_MS,
    );

    if (!confirmationDialog) {
      console.error(
        `[QuikBlocx] No matching block confirmation dialog found for ${targetHandle}.`,
      );
      return;
    }

    const confirmButton = confirmationDialog.querySelector<HTMLButtonElement>(
      '[data-testid="confirmationSheetConfirm"]',
    );

    if (!confirmButton || !isVisible(confirmButton)) {
      console.error(
        `[QuikBlocx] Confirmation button unavailable for ${targetHandle}.`,
      );
      return;
    }

    confirmButton.click();
    console.info(`[QuikBlocx] Block automation completed for ${targetHandle}.`);
  } finally {
    inFlightPosts.delete(post);
  }
}

function findDropdownNBlockButton(
  targetHandle: string,
): DropdownBlockMatch | null {
  const dropdowns = Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="Dropdown"]'),
  );

  for (const dropdown of dropdowns) {
    if (!isVisible(dropdown)) {
      continue;
    }

    const blockButton = dropdown.querySelector<HTMLElement>(
      '[data-testid="block"]',
    );
    if (!blockButton || !isVisible(blockButton)) {
      continue;
    }

    const buttonText = normalizeText(blockButton.innerText);
    if (buttonText.includes(targetHandle)) {
      return {
        blockButton,
        dropdown,
      };
    }
  }

  return null;
}

function findConfirmationDialog(targetHandle: string) {
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-testid="confirmationSheetDialog"]',
    ),
  );

  for (const dialog of dialogs) {
    if (!isVisible(dialog)) {
      continue;
    }

    const headerText = normalizeText(
      dialog.querySelector("h1")?.innerText ?? "",
    );
    if (headerText.includes(targetHandle)) {
      return dialog;
    }
  }

  return null;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

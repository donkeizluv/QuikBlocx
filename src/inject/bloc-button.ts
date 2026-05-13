import { getPostPermalink, type XPost } from "../parser";

const BLOC_BUTTON_SELECTOR = '[data-quikblocx-role="bloc-button"]';

export function injectBlocButton(post: XPost) {
  if (post.querySelector(BLOC_BUTTON_SELECTOR)) {
    return;
  }

  const caretButton = post.querySelector<HTMLButtonElement>(
    '[data-testid="caret"]',
  );
  if (!caretButton) {
    return;
  }

  const caretContainer = caretButton.parentElement;
  if (!caretContainer) {
    return;
  }

  const blocButton = document.createElement("button");
  blocButton.type = "button";
  blocButton.dataset.quikblocxRole = "bloc-button";
  blocButton.textContent = "bloc";
  blocButton.setAttribute("aria-label", "quick block this user");
  blocButton.style.marginRight = "16px";
  blocButton.style.marginLeft = "16px";
  blocButton.style.padding = "4px 12px";
  blocButton.style.border = "none";
  blocButton.style.borderRadius = "9999px";
  blocButton.style.background = "transparent";
  blocButton.style.color = "rgb(244, 33, 46)";
  blocButton.style.font = "inherit";
  blocButton.style.fontWeight = "700";
  blocButton.style.cursor = "pointer";
  blocButton.style.lineHeight = "1.2";

  blocButton.addEventListener("mouseenter", () => {
    blocButton.style.background = "rgba(244, 33, 46, 0.12)";
  });

  blocButton.addEventListener("mouseleave", () => {
    blocButton.style.background = "transparent";
  });

  blocButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const permalink = getPostPermalink(post);
    if (permalink) {
      console.info("[QuikBlocx] Bloc clicked for post:", permalink);
    }
  });

  caretContainer.insertBefore(blocButton, caretButton);
}

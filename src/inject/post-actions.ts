import { runBlockFlow } from "../automation";
import { getPostPermalink, type XPost } from "../parser";

type PostAction = {
  accentColor: string;
  ariaLabel: string;
  id: string;
  label: string;
  onClick: (post: XPost) => Promise<void> | void;
};

const postActions: PostAction[] = [
  {
    id: "bloc-button",
    label: "Bloc",
    ariaLabel: "quick block this user",
    accentColor: "244, 33, 46",
    onClick: async (post) => {
      const permalink = getPostPermalink(post);
      if (permalink) {
        console.info("[QuikBlocx] Bloc clicked for post:", permalink);
      }

      await runBlockFlow(post);
    },
  },
];

export function injectPostActions(post: XPost) {
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

  for (const action of postActions) {
    if (post.querySelector(getActionSelector(action.id))) {
      continue;
    }

    const button = createActionButton(action, post);
    caretContainer.insertBefore(button, caretButton);
  }
}

function createActionButton(action: PostAction, post: XPost) {
  const button = document.createElement("button");
  const hoverBackground = `rgba(${action.accentColor}, 0.12)`;
  const textColor = `rgb(${action.accentColor})`;

  button.type = "button";
  button.dataset.quikblocxRole = action.id;
  button.textContent = action.label;
  button.setAttribute("aria-label", action.ariaLabel);
  button.style.marginRight = "16px";
  button.style.marginLeft = "16px";
  button.style.padding = "4px 12px";
  button.style.border = "none";
  button.style.borderRadius = "9999px";
  button.style.background = "transparent";
  button.style.color = textColor;
  button.style.font = "inherit";
  button.style.fontWeight = "700";
  button.style.cursor = "pointer";
  button.style.lineHeight = "1.2";
  button.style.fontFamily =
    'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  button.addEventListener("mouseenter", () => {
    button.style.background = hoverBackground;
  });

  button.addEventListener("mouseleave", () => {
    button.style.background = "transparent";
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void action.onClick(post);
  });

  return button;
}

function getActionSelector(id: string) {
  return `[data-quikblocx-role="${id}"]`;
}

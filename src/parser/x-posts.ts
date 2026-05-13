export type XPost = HTMLElement;

export type XPostSummary = {
  authorName: string;
  xUserHandle: string;
  permalink: string;
  text: string;
  timestamp: string | null;
};

const PRIMARY_POST_SELECTOR = [
  '[data-testid="primaryColumn"] article[data-testid="tweet"]',
  '[data-testid="primaryColumn"] article[role="article"]',
].join(", ");

export function findPosts(root: ParentNode = document): XPost[] {
  const candidates = Array.from(
    root.querySelectorAll<XPost>(PRIMARY_POST_SELECTOR),
  );
  return candidates.filter(isLikelyPost);
}

export function isLikelyPost(post: Element): post is XPost {
  return Boolean(getPostPermalink(post) && post.querySelector("time"));
}

export function getPostPermalink(post: Element): string | null {
  const permalink = post.querySelector<HTMLAnchorElement>(
    'a[href*="/status/"]',
  );
  return permalink?.href ?? null;
}

export function getPostHandle(post: XPost): string | null {
  const userNameBlock = post.querySelector<HTMLElement>(
    '[data-testid="User-Name"]',
  );
  if (!userNameBlock) {
    return null;
  }

  const handleLink =
    userNameBlock.querySelector<HTMLAnchorElement>(
      'a[href^="/"][tabindex="-1"]',
    ) ??
    Array.from(
      userNameBlock.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'),
    ).find((link) => link.innerText.trim().startsWith("@")) ??
    null;

  if (handleLink) {
    const handleText = handleLink.innerText.trim();
    if (handleText.startsWith("@")) {
      return handleText.toLowerCase();
    }

    const hrefMatch = handleLink.getAttribute("href")?.match(/^\/([^/?#]+)/);
    if (hrefMatch) {
      return `@${hrefMatch[1].toLowerCase()}`;
    }
  }

  const handleTextNode = Array.from(
    userNameBlock.querySelectorAll<HTMLElement>("span"),
  ).find((span) => span.innerText.trim().startsWith("@"));

  return handleTextNode?.innerText.trim().toLowerCase() ?? null;
}

export function summarizePost(post: XPost): XPostSummary {
  const permalink = getPostPermalink(post) ?? "";
  const text =
    post
      .querySelector<HTMLElement>('[data-testid="tweetText"]')
      ?.innerText?.trim() ?? "";
  const time = post.querySelector<HTMLTimeElement>("time");
  const userNameBlock = post.querySelector<HTMLElement>(
    '[data-testid="User-Name"]',
  );
  const nameLink =
    userNameBlock?.querySelector<HTMLAnchorElement>('a[href^="/"]');
  const authorName =
    nameLink?.innerText.split("\n")[0]?.trim() ?? "Unknown author";
  const xUserHandle = getPostHandle(post) ?? "";

  return {
    authorName,
    xUserHandle,
    permalink,
    text,
    timestamp: time?.getAttribute("datetime") ?? null,
  };
}

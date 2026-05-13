export type XPost = HTMLElement;

export type XPostSummary = {
  authorName: string;
  handle: string;
  permalink: string;
  text: string;
  timestamp: string | null;
};

const PRIMARY_POST_SELECTOR = [
  '[data-testid="primaryColumn"] article[data-testid="tweet"]',
  '[data-testid="primaryColumn"] article[role="article"]'
].join(", ");

export function findPosts(root: ParentNode = document): XPost[] {
  const candidates = Array.from(root.querySelectorAll<XPost>(PRIMARY_POST_SELECTOR));
  return candidates.filter(isLikelyPost);
}

export function isLikelyPost(post: Element): post is XPost {
  return Boolean(getPostPermalink(post) && post.querySelector("time"));
}

export function getPostPermalink(post: Element): string | null {
  const permalink = post.querySelector<HTMLAnchorElement>('a[href*="/status/"]');
  return permalink?.href ?? null;
}

export function summarizePost(post: XPost): XPostSummary {
  const permalink = getPostPermalink(post) ?? "";
  const text = post.querySelector<HTMLElement>('[data-testid="tweetText"]')?.innerText?.trim() ?? "";
  const time = post.querySelector<HTMLTimeElement>("time");
  const userNameBlock = post.querySelector<HTMLElement>('[data-testid="User-Name"]');
  const nameLink = userNameBlock?.querySelector<HTMLAnchorElement>('a[href^="/"]');
  const authorName = nameLink?.innerText.split("\n")[0]?.trim() ?? "Unknown author";
  const handleMatch = permalink.match(/x\.com\/([^/]+)\/status\//);
  const handle = handleMatch ? `@${handleMatch[1]}` : "";

  return {
    authorName,
    handle,
    permalink,
    text,
    timestamp: time?.getAttribute("datetime") ?? null
  };
}

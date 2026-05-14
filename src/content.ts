import { injectPostActions } from "./inject";
import {
  findPosts,
  getPostHandle,
  getPostPermalink,
  summarizePost,
  type XPost
} from "./parser";

type PingMessage = {
  type: "PING";
};

type GetPostsMessage = {
  type: "GET_POSTS";
};

type Message = PingMessage | GetPostsMessage;
type PostsResponse = {
  currentHandle: string | null;
  posts: ReturnType<typeof summarizePost>[];
};

const processedPosts = new WeakSet<XPost>();
let currentLoggedInHandle: string | null = null;

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === "PING") {
    void flashPage();
    return;
  }

  if (message.type === "GET_POSTS") {
    const response: PostsResponse = {
      currentHandle: getCurrentLoggedInHandle(),
      posts: findPosts().map(summarizePost)
    };

    void persistCurrentHandle(response.currentHandle);
    sendResponse(response);
  }
});

initializePostObserver();

function initializePostObserver() {
  void syncPageState();

  const observer = new MutationObserver(() => {
    void syncPageState();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

async function syncPageState() {
  await persistCurrentHandle(getCurrentLoggedInHandle());
  processNewPosts();
}

function processNewPosts() {
  const posts = findPosts();

  for (const post of posts) {
    const postHandle = getPostHandle(post);
    if (postHandle && postHandle === currentLoggedInHandle) {
      removeInjectedPostActions(post);
      continue;
    }

    injectPostActions(post);

    if (processedPosts.has(post)) {
      continue;
    }

    processedPosts.add(post);
    post.dataset.quikblocxPost = "true";

    const permalink = getPostPermalink(post);
    if (permalink) {
      post.dataset.quikblocxPermalink = permalink;
    }
  }
}

function removeInjectedPostActions(post: XPost) {
  for (const action of post.querySelectorAll('[data-quikblocx-role]')) {
    action.remove();
  }
}

function getCurrentLoggedInHandle() {
  const profileLink = document.querySelector<HTMLAnchorElement>(
    '[data-testid="AppTabBar_Profile_Link"]',
  );
  const href = profileLink?.getAttribute("href");
  const handleMatch = href?.match(/^\/([^/?#]+)/);

  if (!handleMatch) {
    return null;
  }

  return `@${handleMatch[1].toLowerCase()}`;
}

async function persistCurrentHandle(handle: string | null) {
  if (handle === currentLoggedInHandle) {
    return;
  }

  currentLoggedInHandle = handle;
  await chrome.storage.local.set({
    currentHandle: handle,
  });
}

async function flashPage() {
  const { highlightColor = "#b75e2b" } = await chrome.storage.sync.get("highlightColor");
  const previousOutline = document.documentElement.style.outline;

  document.documentElement.style.outline = `4px solid ${highlightColor}`;

  window.setTimeout(() => {
    document.documentElement.style.outline = previousOutline;
  }, 900);
}

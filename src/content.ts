import { injectPostActions } from "./inject";
import { findPosts, getPostPermalink, summarizePost, type XPost } from "./parser";

type PingMessage = {
  type: "PING";
};

type GetPostsMessage = {
  type: "GET_POSTS";
};

type Message = PingMessage | GetPostsMessage;

const processedPosts = new WeakSet<XPost>();

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === "PING") {
    void flashPage();
    return;
  }

  if (message.type === "GET_POSTS") {
    sendResponse({
      posts: findPosts().map(summarizePost)
    });
  }
});

initializePostObserver();

function initializePostObserver() {
  processNewPosts();

  const observer = new MutationObserver(() => {
    processNewPosts();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function processNewPosts() {
  const posts = findPosts();

  for (const post of posts) {
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

async function flashPage() {
  const { highlightColor = "#b75e2b" } = await chrome.storage.sync.get("highlightColor");
  const previousOutline = document.documentElement.style.outline;

  document.documentElement.style.outline = `4px solid ${highlightColor}`;

  window.setTimeout(() => {
    document.documentElement.style.outline = previousOutline;
  }, 900);
}

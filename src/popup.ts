export {};

type PopupPost = {
  authorName: string;
  xUserHandle: string;
  permalink: string;
  text: string;
  timestamp: string | null;
};

type PostsResponse = {
  posts: PopupPost[];
};

const ui = getPopupUi();

ui.refreshButton.addEventListener("click", () => {
  void loadPosts();
});

void loadPosts();

async function loadPosts() {
  setLoadingState();

  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  if (!activeTab?.id || !activeTab.url?.startsWith("https://x.com/")) {
    renderPosts([]);
    ui.postCount.textContent = "0";
    ui.tabStatus.textContent = "Open X";
    ui.statusMessage.textContent = "Open an X tab, then refresh.";
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(activeTab.id, {
      type: "GET_POSTS"
    }) as PostsResponse | undefined;

    const posts = response?.posts ?? [];
    renderPosts(posts);
    ui.postCount.textContent = String(posts.length);
    ui.tabStatus.textContent = "Connected";
    ui.statusMessage.textContent = `Scanned ${posts.length} posts on the current X tab.`;
  } catch {
    renderPosts([]);
    ui.postCount.textContent = "0";
    ui.tabStatus.textContent = "Unavailable";
    ui.statusMessage.textContent = "Could not read posts from this tab yet. Reload the X page and try again.";
  }
}

function setLoadingState() {
  ui.tabStatus.textContent = "Scanning";
  ui.statusMessage.textContent = "Reading posts from the current X tab...";
}

function renderPosts(posts: PopupPost[]) {
  if (posts.length === 0) {
    ui.postsList.innerHTML = '<div class="empty-state">No posts found in the current X timeline.</div>';
    return;
  }

  ui.postsList.replaceChildren(...posts.map(createPostItem));
}

function createPostItem(post: PopupPost) {
  const article = document.createElement("article");
  article.className = "post-item";

  const header = document.createElement("div");
  header.className = "post-header";

  const author = document.createElement("strong");
  author.className = "post-author";
  author.textContent = post.authorName;

  const time = document.createElement("span");
  time.className = "post-time";
  time.textContent = formatTimestamp(post.timestamp);

  header.append(author, time);

  const userHandle = document.createElement("div");
  userHandle.className = "user-handle";
  userHandle.textContent = post.xUserHandle;

  const text = document.createElement("p");
  text.className = "post-text";
  text.textContent = post.text || "(No text content)";

  const link = document.createElement("a");
  link.className = "post-link";
  link.href = post.permalink;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Open post";

  article.append(header, userHandle, text, link);
  return article;
}

function formatTimestamp(timestamp: string | null) {
  if (!timestamp) {
    return "No time";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "No time";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getPopupUi() {
  const postCount = document.querySelector<HTMLElement>("#post-count");
  const tabStatus = document.querySelector<HTMLElement>("#tab-status");
  const refreshButton = document.querySelector<HTMLButtonElement>("#refresh-button");
  const statusMessage = document.querySelector<HTMLParagraphElement>("#status");
  const postsList = document.querySelector<HTMLDivElement>("#posts-list");

  if (!postCount || !tabStatus || !refreshButton || !statusMessage || !postsList) {
    throw new Error("Popup UI did not load correctly.");
  }

  return {
    postCount,
    postsList,
    refreshButton,
    statusMessage,
    tabStatus
  };
}

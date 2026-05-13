export async function waitForElement<T>(
  getElement: () => T | null,
  timeoutMs = 3000,
  intervalMs = 100,
): Promise<T | null> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const element = getElement();
    if (element) {
      return element;
    }

    await delay(intervalMs);
  }

  return null;
}

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function isVisible(element: Element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.offsetParent !== null
  );
}

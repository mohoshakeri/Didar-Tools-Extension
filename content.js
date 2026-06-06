(function () {
  const TELEGRAM_SELECTOR =
    'a.whatsapp-msg[target="_blank"][title*="تلگرام"][href*="t.me"]';
  const BALE_TITLE = "ارسال پیام در بله";
  const GENERATED_ATTRIBUTE = "data-didar-tools-generated";
  const LOG_PREFIX = "[Didar Tools]";
  const RUNTIME_API = globalThis.browser?.runtime || globalThis.chrome?.runtime;
  const BALE_ICON_URL =
    RUNTIME_API?.getURL("icons/bale.png") ||
    new URL("icons/bale.png", document.currentScript?.src || window.location.href).href;
  let syncTimer = 0;

  function log(message, data) {
    if (data === undefined) {
      console.log(LOG_PREFIX, message);
      return;
    }

    console.log(LOG_PREFIX, message, data);
  }

  log("content script loaded", {
    href: window.location.href,
    iconUrl: BALE_ICON_URL,
    readyState: document.readyState
  });

  function getTelegramPhone(telegramLink) {
    const href = telegramLink.getAttribute("href");

    if (!href) {
      log("telegram link skipped: empty href", telegramLink);
      return "";
    }

    try {
      const url = new URL(href, window.location.href);

      if (url.hostname !== "t.me") {
        log("telegram link skipped: hostname is not t.me", href);
        return "";
      }

      return url.pathname.replace(/^\/+/, "");
    } catch (_error) {
      log("telegram link skipped: invalid href", href);
      return "";
    }
  }

  function createBaleLink(phone) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.title = BALE_TITLE;
    link.href = `https://ble.ir/${phone}`;
    link.className = "whatsapp-msg";
    link.setAttribute(GENERATED_ATTRIBUTE, "bale");

    const image = document.createElement("img");
    image.alt = "didar-crm-telegram";
    image.src = BALE_ICON_URL;

    link.appendChild(image);
    return link;
  }

  function addBaleLinkAfterTelegram(telegramLink) {
    if (!telegramLink) {
      log("add skipped: telegramLink is empty");
      return;
    }

    const phone = getTelegramPhone(telegramLink);

    if (!phone) {
      log("add skipped: phone not found", telegramLink.outerHTML);
      return;
    }

    const nextElement = telegramLink.nextElementSibling;

    if (nextElement?.getAttribute(GENERATED_ATTRIBUTE) === "bale") {
      nextElement.href = `https://ble.ir/${phone}`;
      log("existing bale link updated", {
        phone,
        href: nextElement.href
      });
      return;
    }

    const baleLink = createBaleLink(phone);
    telegramLink.insertAdjacentElement("afterend", baleLink);
    log("bale link inserted", {
      phone,
      href: baleLink.href,
      iconSrc: baleLink.querySelector("img")?.src,
      parentHtml: telegramLink.parentElement?.outerHTML
    });
  }

  function syncBaleLinks(root) {
    const scope = root instanceof Element ? root : document;
    const telegramLinks = [
      ...(scope.matches?.(TELEGRAM_SELECTOR) ? [scope] : []),
      ...scope.querySelectorAll(TELEGRAM_SELECTOR)
    ];

    log("sync", {
      root: scope === document ? "document" : scope.tagName,
      count: telegramLinks.length
    });

    telegramLinks.forEach(addBaleLinkAfterTelegram);
  }

  function scheduleSync(root) {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      syncBaleLinks(root || document);
    }, 50);
  }

  syncBaleLinks(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        scheduleSync(mutation.target);
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          scheduleSync(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "href", "target", "title"],
    childList: true,
    subtree: true
  });

  window.setTimeout(() => syncBaleLinks(document), 500);
  window.setTimeout(() => syncBaleLinks(document), 1500);
  window.setTimeout(() => syncBaleLinks(document), 3000);
})();

// Reddit Content Script - DOM Scanner & Reply Poster
// Runs on Reddit pages. Scans for keyword-matching posts, posts replies via DOM.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        try {
            switch (message.type) {
                case "SCAN_PAGE":
                    const posts = await scanRedditPage(message.config);
                    chrome.runtime.sendMessage({ type: "FOUND_POSTS", platform: "reddit", posts });
                    sendResponse({ success: true, posts_found: posts.length });
                    break;
                case "POST_REPLY":
                    const posted = await postReplyToReddit(message.post_id, message.reply_text);
                    sendResponse({ success: posted });
                    break;
                case "GET_POST_TEXT":
                    const text = extractPostText(message.post_id);
                    sendResponse({ success: true, text });
                    break;
                default:
                    sendResponse({ success: false, error: "Unknown message type" });
            }
        }
        catch (error) {
            console.error("[Reddit Content] Error:", error);
            sendResponse({ success: false, error: error.message });
        }
    })();
    return true;
});
async function scanRedditPage(config) {
    const posts = [];
    const keywords = config.keywords.map((k) => k.toLowerCase());
    const postSelectors = [
        '[data-testid="post-container"]',
        '[data-click-id="body"]',
        'div[role="link"]',
        '.thing',
        '.link',
    ];
    let postElements = [];
    for (const selector of postSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            postElements = Array.from(elements);
            break;
        }
    }
    console.log(`[Reddit Content] Scanning ${postElements.length} posts`);
    for (const el of postElements) {
        const titleEl = el.querySelector('h3, h1, a[data-click-id="body"], a.title, .title a');
        const title = titleEl?.textContent?.trim() || "";
        if (el.getAttribute("data-csa-processed") === "true")
            continue;
        const titleLower = title.toLowerCase();
        const matchedKeywords = keywords.filter((k) => titleLower.includes(k.toLowerCase()));
        if (matchedKeywords.length === 0)
            continue;
        const linkEl = el.querySelector('a[href^="/r/"], a[data-click-id="body"]');
        let url = linkEl?.getAttribute("href") || "";
        if (url && !url.startsWith("http")) {
            url = `https://www.reddit.com${url}`;
        }
        const subredditMatch = url.match(/\/r\/([^\/]+)/);
        const subreddit = subredditMatch ? subredditMatch[1] : "";
        const bodyEl = el.querySelector('[data-testid="post-content"], .usertext-body, .md');
        const bodyText = bodyEl?.textContent?.trim().substring(0, 500) || "";
        const relevanceScore = matchedKeywords.length / keywords.length;
        const postId = el.getAttribute("data-fullname") || el.getAttribute("id") || `reddit_${Date.now()}_${posts.length}`;
        posts.push({ id: postId, platform: "reddit", title, url, subreddit, body_text: bodyText, matched_keywords: matchedKeywords, relevance_score: relevanceScore });
        el.setAttribute("data-csa-processed", "true");
    }
    console.log(`[Reddit Content] Found ${posts.length} matching posts`);
    return posts;
}
async function postReplyToReddit(postId, replyText) {
    try {
        await waitForElement('[data-testid="comment-submission-form-richtext"], textarea, .usertext-edit textarea', 5000);
        const textAreaSelectors = [
            '[data-testid="comment-submission-form-richtext"] div[contenteditable="true"]',
            '[data-testid="comment-submission-form-richtext"] textarea',
            'textarea[placeholder*="reply"]',
            'textarea[placeholder*="comment"]',
            '.usertext-edit textarea',
            'div[contenteditable="true"][role="textbox"]',
        ];
        let textArea = null;
        for (const selector of textAreaSelectors) {
            textArea = document.querySelector(selector);
            if (textArea)
                break;
        }
        if (!textArea) {
            console.error("[Reddit Content] Could not find reply textarea");
            return false;
        }
        if (textArea.isContentEditable) {
            textArea.textContent = replyText;
            textArea.dispatchEvent(new Event("input", { bubbles: true }));
            textArea.dispatchEvent(new Event("change", { bubbles: true }));
        }
        else {
            textArea.value = replyText;
            textArea.dispatchEvent(new Event("input", { bubbles: true }));
            textArea.dispatchEvent(new Event("change", { bubbles: true }));
        }
        await sleep(500);
        const submitSelectors = [
            'button[type="submit"]:not([disabled])',
            '[data-testid="comment_submit_button"]',
            '.save-button button',
        ];
        let submitButton = null;
        for (const selector of submitSelectors) {
            submitButton = document.querySelector(selector);
            if (submitButton && !submitButton.disabled)
                break;
        }
        if (!submitButton) {
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                const text = btn.textContent?.toLowerCase() || '';
                if ((text.includes('comment') || text.includes('reply') || text.includes('save')) && !btn.disabled) {
                    submitButton = btn;
                    break;
                }
            }
        }
        if (!submitButton) {
            console.error("[Reddit Content] Could not find submit button");
            return false;
        }
        submitButton.click();
        await sleep(2000);
        const replyPosted = checkReplyPosted(replyText);
        if (replyPosted) {
            chrome.runtime.sendMessage({ type: "REPLY_POSTED", post_id: postId, post_url: window.location.href, clicks: 0 });
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("[Reddit Content] Post reply error:", error);
        return false;
    }
}
function extractPostUrl(postId) {
    const el = document.querySelector(`[data-fullname="${postId}"], [id="${postId}"]`);
    if (el) {
        const link = el.querySelector('a[href^="/r/"]');
        const href = link?.getAttribute("href");
        if (href) {
            return href.startsWith("http") ? href : `https://www.reddit.com${href}`;
        }
    }
    return null;
}
function extractPostText(postId) {
    const el = document.querySelector(`[data-fullname="${postId}"], [id="${postId}"]`);
    if (el) {
        const bodyEl = el.querySelector('[data-testid="post-content"], .usertext-body, .md');
        return bodyEl?.textContent?.trim() || "";
    }
    return "";
}
function checkReplyPosted(replyText) {
    const allText = document.body.textContent || "";
    const shortText = replyText.substring(0, 50);
    return allText.includes(shortText);
}
function waitForElement(selector, timeout) {
    return new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (el) {
            resolve(el);
            return;
        }
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
(async () => {
    const result = await chrome.storage.local.get("agent_active");
    if (result.agent_active) {
        const config = await chrome.storage.local.get("agent_config");
        if (config.agent_config) {
            await sleep(3000);
            const posts = await scanRedditPage(config.agent_config);
            if (posts.length > 0) {
                chrome.runtime.sendMessage({ type: "FOUND_POSTS", platform: "reddit", posts });
            }
        }
    }
})();
export {};

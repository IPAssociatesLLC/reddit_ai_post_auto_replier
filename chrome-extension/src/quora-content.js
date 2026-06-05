// Quora Content Script - DOM Scanner & Reply Poster
// Runs on Quora pages. Scans questions, posts answers via DOM.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        try {
            switch (message.type) {
                case "SCAN_PAGE":
                    const posts = await scanQuoraPage(message.config);
                    chrome.runtime.sendMessage({ type: "FOUND_POSTS", platform: "quora", posts });
                    sendResponse({ success: true, posts_found: posts.length });
                    break;
                case "POST_REPLY":
                    const posted = await postReplyToQuora(message.post_id, message.reply_text);
                    sendResponse({ success: posted });
                    break;
                case "GET_QUESTION_TEXT":
                    const text = extractQuestionText(message.question_id);
                    sendResponse({ success: true, text });
                    break;
                default:
                    sendResponse({ success: false, error: "Unknown message type" });
            }
        }
        catch (error) {
            console.error("[Quora Content] Error:", error);
            sendResponse({ success: false, error: error.message });
        }
    })();
    return true;
});
async function scanQuoraPage(config) {
    const posts = [];
    const keywords = config.keywords.map((k) => k.toLowerCase());
    const questionSelectors = [
        '[data-testid="question_card"]',
        '[data-testid="paged_list_item"]',
        '.q-box .qu-mb--tiny',
        '[data-testid="question_title"]',
        '.question_text_editor',
        '[action="/ajax/log_browser_event_"]',
        '.qu-borderAll',
    ];
    let questionElements = [];
    for (const selector of questionSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            questionElements = Array.from(elements);
            break;
        }
    }
    console.log(`[Quora Content] Scanning ${questionElements.length} questions`);
    for (const el of questionElements) {
        const titleEl = el.querySelector('[data-testid="question_title"]') || el.querySelector('h1') || el.querySelector('a[href*="/question/"]') || el.querySelector('.question_link') || el.querySelector('.q-box span') || el.querySelector('span');
        const title = titleEl?.textContent?.trim() || "";
        if (!title)
            continue;
        if (el.getAttribute("data-csa-processed") === "true")
            continue;
        const titleLower = title.toLowerCase();
        const matchedKeywords = keywords.filter((k) => titleLower.includes(k.toLowerCase()));
        if (matchedKeywords.length === 0)
            continue;
        const linkEl = el.querySelector('a[href*="/question/"]') || el.querySelector('a[href^="/"]');
        let url = linkEl?.getAttribute("href") || "";
        if (url && !url.startsWith("http")) {
            url = `https://www.quora.com${url}`;
        }
        if (!url) {
            url = window.location.href;
        }
        const topicEl = el.querySelector('[data-testid="topic_name"]') || el.querySelector('a[href*="/topic/"]') || document.querySelector('[data-testid="topic_name"]');
        const topic = topicEl?.textContent?.trim() || "";
        const bodyEl = el.querySelector('[data-testid="question_details"]') || el.querySelector('.question_details') || el.querySelector('.q-box .qu-overflowHidden');
        const bodyText = bodyEl?.textContent?.trim().substring(0, 500) || "";
        const relevanceScore = matchedKeywords.length / keywords.length;
        const postId = el.getAttribute("data-qid") || el.getAttribute("id") || el.getAttribute("data-testid") || `quora_${Date.now()}_${posts.length}`;
        posts.push({ id: postId, platform: "quora", title, url, topic, body_text: bodyText, matched_keywords: matchedKeywords, relevance_score: relevanceScore });
        el.setAttribute("data-csa-processed", "true");
    }
    console.log(`[Quora Content] Found ${posts.length} matching questions`);
    return posts;
}
async function postReplyToQuora(postId, replyText) {
    try {
        await waitForElement('[data-testid="answer_button"], [data-testid="answer_editor"], .q-click-wrapper, [contenteditable="true"]', 5000);
        const answerButtonSelectors = [
            '[data-testid="answer_button"]',
            'button:has-text("Answer")',
            'a:has-text("Answer")',
            '.q-click-wrapper:has-text("Answer")',
            'button:has-text("Write")',
        ];
        let answerButton = null;
        for (const selector of answerButtonSelectors) {
            if (selector.includes(':has-text')) {
                const elements = document.querySelectorAll(selector.split(':has-text')[0]);
                for (const el of elements) {
                    const text = el.textContent?.toLowerCase() || '';
                    if (text.includes('answer') || text.includes('write')) {
                        answerButton = el;
                        break;
                    }
                }
            }
            else {
                answerButton = document.querySelector(selector);
            }
            if (answerButton)
                break;
        }
        if (answerButton) {
            answerButton.click();
            await sleep(1000);
        }
        const editorSelectors = [
            '[data-testid="answer_editor"] [contenteditable="true"]',
            '[data-testid="answer_editor"] textarea',
            '.q-box [contenteditable="true"]',
            'div[contenteditable="true"][role="textbox"]',
            '.q-textEditor',
            '.editor',
        ];
        let editor = null;
        for (const selector of editorSelectors) {
            editor = document.querySelector(selector);
            if (editor)
                break;
        }
        if (!editor) {
            console.error("[Quora Content] Could not find answer editor");
            return false;
        }
        if (editor.isContentEditable) {
            editor.textContent = replyText;
            editor.dispatchEvent(new Event("input", { bubbles: true }));
            editor.dispatchEvent(new Event("change", { bubbles: true }));
        }
        else {
            editor.value = replyText;
            editor.dispatchEvent(new Event("input", { bubbles: true }));
            editor.dispatchEvent(new Event("change", { bubbles: true }));
        }
        await sleep(800);
        const postButtonSelectors = [
            '[data-testid="submit_button"]',
            'button:has-text("Post")',
            'button:has-text("Submit")',
            '.q-click-wrapper:has-text("Post")',
            'button[type="submit"]',
        ];
        let postButton = null;
        for (const selector of postButtonSelectors) {
            if (selector.includes(':has-text')) {
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    const text = btn.textContent?.toLowerCase() || '';
                    if (text.includes('post') || text.includes('submit') || text.includes('answer')) {
                        postButton = btn;
                        break;
                    }
                }
            }
            else {
                postButton = document.querySelector(selector);
            }
            if (postButton)
                break;
        }
        if (!postButton) {
            console.error("[Quora Content] Could not find Post button");
            return false;
        }
        postButton.click();
        await sleep(2000);
        const answerPosted = checkAnswerPosted(replyText);
        if (answerPosted) {
            chrome.runtime.sendMessage({ type: "REPLY_POSTED", post_id: postId, post_url: window.location.href, clicks: 0 });
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("[Quora Content] Post reply error:", error);
        return false;
    }
}
function extractQuestionUrl(questionId) {
    const el = document.querySelector(`[data-qid="${questionId}"], [id="${questionId}"]`);
    if (el) {
        const link = el.querySelector('a[href*="/question/"]') || el.querySelector('a[href^="/"]');
        const href = link?.getAttribute("href");
        if (href) {
            return href.startsWith("http") ? href : `https://www.quora.com${href}`;
        }
    }
    return null;
}
function extractQuestionText(questionId) {
    const el = document.querySelector(`[data-qid="${questionId}"], [id="${questionId}"]`);
    if (el) {
        const detailsEl = el.querySelector('[data-testid="question_details"]') || el.querySelector('.question_details');
        return detailsEl?.textContent?.trim() || "";
    }
    return "";
}
function checkAnswerPosted(replyText) {
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
            const posts = await scanQuoraPage(config.agent_config);
            if (posts.length > 0) {
                chrome.runtime.sendMessage({ type: "FOUND_POSTS", platform: "quora", posts });
            }
        }
    }
})();
export {};

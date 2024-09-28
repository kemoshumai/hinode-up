let tokenizer = null;
let to_hinode = null;
let sanitize = null;

wasm_bindgen("./pkg/hinode_up_bg.wasm").then(() => {

    console.log('Wasm module loaded');

    const { HinodejiTokenizer } = wasm_bindgen;

    tokenizer = new HinodejiTokenizer();
    to_hinode = wasm_bindgen.to_hinode;
    sanitize = wasm_bindgen.sanitize;

    console.log('Tokenizer loaded');

});

const getHinodeFormat = (text) => {
    let sanitized = sanitize(text);
    const tokens = tokenizer.tokenize(sanitized);
    const hinode = to_hinode(tokens.join(" "));
    return hinode;
}

const getIsReady = () => {
    return tokenizer !== null;
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getHinodeFormat') {
        const result = getHinodeFormat(message.data);
        sendResponse({ result });
    } else if (message.action === 'getIsReady') {
        const result = getIsReady();
        sendResponse({ result });
    }
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    browser.tabs.sendMessage(tab.id, { message: "tab_activated" });
});

console.log('Background script running');


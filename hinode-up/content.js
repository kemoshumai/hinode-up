const replaceTextNode = (element, callback) => {
    if (!element.checkVisibility()) {
        return;
    }
    [...element.childNodes]
        .filter(n => n.nodeName === "#text")
        .filter(n => n.textContent.trim().length > 0)  // 空白文字のみのノードも除外
        .forEach(n => callback(n));
    [...element.children].forEach(n=>replaceTextNode(n, callback));
};


const translatePage = async () => {

    await new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });

    const callback = async (node) => {
        const text = node.textContent;
        const response = await browser.runtime.sendMessage({ action: "getHinodeFormat", data: text });
        node.textContent = response.result;
    };

    replaceTextNode(document.body, callback);

    // ページの変更を監視して、新たに追加されたテキストも翻訳する
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                replaceTextNode(node, callback);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

const getIsReady = async () => {
    const response = await browser.runtime.sendMessage({ action: "getIsReady" });
    return response.result;
}

const overrideFont = async () => {

    const font_url = browser.runtime.getURL('nkc02_hinodeji.otf');

    const css = `
* {
    font-family: "NKC02 Hinodeji", sans-serif !important;
}`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

const main = async () => {
    // 設定を取得
    const { is_hinode_up_enabled, is_translation_enabled, is_font_override_enabled } = await browser.storage.local.get();
    
    // hinode-up のデフォルト状態をオンにする
    await browser.storage.local.set({ is_hinode_up_enabled: true });

    // hinode up が有効化されている場合のみ翻訳・変更を行う
    if (is_hinode_up_enabled){
        // 翻訳が有効化されていたら翻訳する
        if (is_translation_enabled){
            await new Promise((resolve) => {
                const interval = setInterval(async () => {
                    if (await getIsReady()){
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
            translatePage();
        }
        
        // フォント変更が有効化されていたらフォントを変更する
        if (is_font_override_enabled){
            overrideFont();
        }
    }

    // 設定が変更されたらページをリロードする
    browser.runtime.onMessage.addListener(async (message) => {
        if (message.message === 'tab_activated') {
            console.log('tab_activated');
            const storage = await browser.storage.local.get();
            const is_translation_enabled_before = is_translation_enabled;
            const is_font_override_enabled_before = is_font_override_enabled;
            const is_translation_enabled_after = storage.is_translation_enabled;
            const is_font_override_enabled_after = storage.is_font_override_enabled;
            if (is_translation_enabled_before !== is_translation_enabled_after || is_font_override_enabled_before !== is_font_override_enabled_after){
                location.reload();
            }
        }
    });
}

main();
const main = async () => {
    const toggle_hinode_up = document.getElementById('toggle-hinode-up');
    const toggle_translation = document.getElementById('toggle-translation');
    const toggle_font = document.getElementById('toggle-font');
    const log = document.getElementById('log');

    const is_hinode_up_enabled = await browser.storage.local.get("is_hinode_up_enabled");
    const is_translation_enabled = await browser.storage.local.get("is_translation_enabled");
    const is_font_override_enabled = await browser.storage.local.get("is_font_override_enabled");

    toggle_hinode_up.checked = is_hinode_up_enabled.is_hinode_up_enabled;
    toggle_translation.checked = is_translation_enabled.is_translation_enabled;
    toggle_font.checked = is_font_override_enabled.is_font_override_enabled;

    toggle_hinode_up.addEventListener('change', async () => {
        await browser.storage.local.set({ is_hinode_up_enabled: toggle_hinode_up.checked });
        reload();
    });

    toggle_translation.addEventListener('change', async () => {
        await browser.storage.local.set({ is_translation_enabled: toggle_translation.checked });
        reload();
    });

    toggle_font.addEventListener('change', async () => {
        await browser.storage.local.set({ is_font_override_enabled: toggle_font.checked });
        reload();
    });

}

const reload = () => {
    browser.tabs.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    main();
});

print("Popup script running");
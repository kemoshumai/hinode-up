const main = async () => {
    const toggle = document.getElementById('toggle-translation');
    const toggle_font = document.getElementById('toggle-font');
    const log = document.getElementById('log');

    const is_translation_enabled = await browser.storage.local.get("is_translation_enabled");
    const is_font_override_enabled = await browser.storage.local.get("is_font_override_enabled");

    toggle.checked = is_translation_enabled.is_translation_enabled;
    toggle_font.checked = is_font_override_enabled.is_font_override_enabled;

    toggle.addEventListener('change', async () => {
        await browser.storage.local.set({ is_translation_enabled: toggle.checked });
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
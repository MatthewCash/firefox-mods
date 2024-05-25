const EXPORTED_SYMBOLS = [];

(() => {
    const run = window => {
        const { document } = window;

        document
            .querySelector('#main-window')
            .setAttribute('chromemargin', '0,0,0,0');

        const onTabUpdate = () => {
            const inNewTab = ['about:newtab', 'about:blank'].includes(
                window.gBrowser.currentURI.spec
            );

            document.querySelector('#tabbrowser-tabpanels').style.visibility =
                inNewTab ? 'hidden' : 'visible';
            document.querySelector('#main-window').style.backgroundImage =
                inNewTab
                    ? 'url("chrome://mods/content/resources/images/background.svg")'
                    : null;
            document.querySelector('#tabbrowser-tabbox').style[
                '-moz-window-dragging'
            ] = inNewTab ? 'drag' : 'no-drag';

            const tabCount = window.gBrowser.tabs.length;
            const sidebarHeight = (tabCount + 1) * 38;
            if (sidebarHeight > 1)
                document.querySelector('#sidebar').style.maxHeight =
                    `${sidebarHeight}px`;
        };

        new window.MutationObserver(onTabUpdate).observe(
            window._gBrowser.tabContainer,
            { attributes: true, childList: true, subtree: true }
        );

        const draggable = document.createElement('div');
        draggable.id = 'sidebar-draggable';
        document.querySelector('#sidebar-box').appendChild(draggable);

        console.log('Script loaded');
    };

    try {
        const chromeRegex =
            /^(chrome:(?!\/\/(global\/content\/commonDialog|browser\/content\/webext-panels)\.x?html)|about:(?!blank))/i;

        class ChromeDocumentObserver {
            constructor() {
                Services.obs.addObserver(
                    this,
                    'chrome-document-global-created',
                    false
                );
            }
            observe(aSubject, topic) {
                aSubject.addEventListener('DOMContentLoaded', this, {
                    once: true
                });
            }
            handleEvent(event) {
                const document = event.originalTarget;
                const window = document.defaultView;

                if (chromeRegex.test(window.location.href) && window._gBrowser)
                    run(window);
            }
        }

        if (!Services.appinfo.inSafeMode) new ChromeDocumentObserver();
    } catch (error) {
        Services.prompt.alert(null, 'Failed to setup JS mods!', error);
    }
})();

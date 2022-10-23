(() => {
    const run = window => {
        const { document } = window;
        let oldTabCount = 0;

        const onTabUpdate = () => {
            const inNewTab = ['about:newtab', 'about:blank'].includes(window.gBrowser.currentURI.spec);

            document.querySelector('#tabbrowser-tabpanels').style.visibility = inNewTab ? 'hidden' : 'visible';
            document.querySelector('#main-window').style.backgroundImage = inNewTab ? 'url("chrome://resources/content/images/background.svg")' : null;
            document.querySelector('#tabbrowser-tabbox').style['-moz-window-dragging'] = inNewTab ? 'drag' : 'no-drag';

            const tabCount = window.gBrowser.tabs.length;
            const sidebarHeight = (tabCount + 1) * 38;
            if (sidebarHeight > 1) document.querySelector('#sidebar').style.maxHeight = `${sidebarHeight}px`;

            oldTabCount = tabCount;
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
        const { classes, interfaces, manager } = Components;
        const { Services } = Components.utils.import('resource://gre/modules/Services.jsm');

        function ConfigJS() { Services.obs.addObserver(this, 'chrome-document-global-created', false); }
        ConfigJS.prototype = {
            observe: function (aSubject) { aSubject.addEventListener('DOMContentLoaded', this, { once: true }); },
            handleEvent: function (event) {
                const document = event.originalTarget;
                const window = document.defaultView;
                const location = window.location;
                if (/^(chrome:(?!\/\/(global\/content\/commonDialog|browser\/content\/webext-panels)\.x?html)|about:(?!blank))/i.test(location.href)) {
                    if (window._gBrowser) run(window);
                }}
        };

        if (!Services.appinfo.inSafeMode) { new ConfigJS(); }
    } catch (ex) { };
})();
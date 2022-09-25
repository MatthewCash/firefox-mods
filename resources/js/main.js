(() => {
    const run = window => {
        const { document } = window;

        const callback = mutations => {
            for (const mutation of mutations) {
                if (mutation.type !== 'attributes') continue;
                if (mutation?.target?.getAttribute('primary') !== 'true') continue;

                let inNewTab = false;
                try {
                    inNewTab = mutation.target.contentPartitionedPrincipal?.URI?.asciiSpec === 'about:newtab';
                } catch { };

                console.log({ inNewTab });
                document.querySelector('#tabbrowser-tabpanels').style.visibility = inNewTab ? 'hidden' : 'visible';
                document.querySelector('#main-window').style.backgroundImage = inNewTab ? 'url("chrome://resources/content/images/background.svg")' : null;
                document.querySelector('#tabbrowser-tabbox').style['-moz-window-dragging'] = inNewTab ? 'drag' : 'no-drag';
            }
        };

        new window.MutationObserver(callback).observe(document.querySelector('#tabbrowser-tabpanels'), { attributes: true, childList: true, subtree: true });

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
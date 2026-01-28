const EXPORTED_SYMBOLS = [];

(() => {
    console.log('Starting main script...');

    const init = window => {
        console.log('Running main-window setup...');
        const { document } = window;
        const mainWindow = document.querySelector('#main-window');

        if (mainWindow.getAttribute('sizemode') === 'normal')
            mainWindow.setAttribute('hidechrome', 'true');

        const onWindowAttributeChange = mutations => {
            mutations.forEach(mutation => {
                if (mutation.type !== 'attributes') return;
                if (mutation.attributeName !== 'sizemode') return;

                if (mainWindow.getAttribute('sizemode') === 'normal') {
                    mainWindow.setAttribute('hidechrome', 'true');
                } else {
                    mainWindow.setAttribute('hidechrome', 'false');
                }
            });
        };

        new window.MutationObserver(onWindowAttributeChange).observe(
            mainWindow,
            {
                attributes: true
            }
        );

        // FIXME: remove once 148b7 makes it to nixos-unstable
        const monitorBrowserTransparency = browser => {
            browser.setAttribute('transparent', 'true');

            // The property seems to get reset immediately, so keep watching
            const observer = new window.MutationObserver(() => {
                if (browser.getAttribute('transparent') !== 'true') {
                    browser.setAttribute('transparent', 'true');
                }
            });

            observer.observe(browser, {
                attributes: true,
                attributeFilter: ['transparent']
            });
        };
        window.gBrowser.tabContainer.addEventListener('TabOpen', event => {
            const browser = event.target.linkedBrowser;
            if (browser) monitorBrowserTransparency(browser);
        });
        window.gBrowser.browsers.forEach(monitorBrowserTransparency);

        const draggable = document.createElement('div');
        draggable.id = 'sidebar-draggable';
        document.querySelector('#sidebar-box').appendChild(draggable);

        console.log('Setup complete!');
    };

    try {
        class ChromeDocumentObserver {
            constructor() {
                Services.obs.addObserver(this, 'domwindowopened', false);
            }
            observe(subject, topic) {
                // this is gross but the best I could think of
                let checkInterval = subject.setInterval(() => {
                    if (subject.document.querySelector('#main-window')) {
                        subject.clearInterval(checkInterval);
                        init(subject);
                    }
                }, 1);

                subject.setTimeout(
                    () => subject.clearInterval(checkInterval),
                    5000
                );
            }
        }

        if (!Services.appinfo.inSafeMode) new ChromeDocumentObserver();
    } catch (error) {
        Services.prompt.alert(null, 'Failed to setup JS mods!', error);
    }
})();

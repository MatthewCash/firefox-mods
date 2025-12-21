const EXPORTED_SYMBOLS = [];

(() => {
    console.log("Starting main script...");

    const run = window => {
        console.log("Running main-window setup...");
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

        const draggable = document.createElement('div');
        draggable.id = 'sidebar-draggable';
        document.querySelector('#sidebar-box').appendChild(draggable);

        console.log('Setup complete!');
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
            observe(aSubject, _topic) {
                aSubject.addEventListener('DOMContentLoaded', this, {
                    once: true
                });
            }
            handleEvent(event) {
                const document = event.originalTarget;
                const window = document.defaultView;
                if (chromeRegex.test(window.location.href))
                    run(window);
            }
        }

        if (!Services.appinfo.inSafeMode) new ChromeDocumentObserver();
    } catch (error) {
        Services.prompt.alert(null, 'Failed to setup JS mods!', error);
    }
})();

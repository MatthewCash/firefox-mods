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

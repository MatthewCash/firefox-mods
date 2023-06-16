// Firefox Javascript Loader
try {
    const { classes, interfaces, manager, utils } = Components;

    const manifest = classes['@mozilla.org/file/directory_service;1']
        .getService(interfaces.nsIProperties)
        .get('UChrm', interfaces.nsIFile);

    manifest.append('chrome.manifest');

    if (manifest.exists()) {
        manager.QueryInterface(interfaces.nsIComponentRegistrar).autoRegister(manifest);
        utils.import('chrome://mods/content/entrypoint.js');
    }
} catch (error) {
    console.warn('Failed to load JS mods!');
    console.error(error);
}

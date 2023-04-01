# firefox-mods

Firefox customization for chrome and site styles

## Customizations

- My layout for Firefox which heavily changes and removes part of the chrome
- Site specific changes, mostly changing the site's accent color and removing unused elements
- Recoloring of Firefox elements in chrome and in the browser's pages

## Usage

Installation is not user-friendly, you are expected to be familiar with CSS, JS, and Firefox userChrome!

1. Create a `chrome` directory in firefox user profile (found in `about:profiles`)
2. If necessary, [create a symbolic link](#linking) to this repository
3. Follow instructions to optionally enable [Chrome Styling](#chrome-styling), [Page Styling](#page-styling), and [JavaScript Mods](#javascript-mods)

## Linking

Creating a symbolic link allows JavaScript to be loaded and for non-privileged processes to access files in the home directory on Windows

Create a link in your profile's chrome directory pointing to this repository

```sh
# Linux
ln -s chrome/firefox-mods ./wherever/someplace/firefox-mods
```

```batch
:: Windows
mklink /D chrome\firefox-mods ..\wherever\someplace\firefox-mods
```

## Chrome Styling

1. Create a file in your chrome directory named `userChrome.css`
2. Import this repository's chrome files
```css
@import "/wherever/someplace/firefox-mods/css/chrome/colors.css";
/* optional if you want the modified layout */
@import "/wherever/someplace/firefox-mods/css/chrome/layout.css"
```
3. Set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true` in `about:config`

## Page Styling

1. Create a file in your chrome directory named `userContent.css`
2. Import this repository's `userContent.css` file
```css
@import "/wherever/someplace/firefox-mods/userContent.css";
```

## JavaScript Mods

1. Create a file in your chrome directory named `chrome.manifest` with only the text `content mods ./`
2. Create a file in your chrome directory named 'entrypoint.js'
3. Import this repository's `main.js` file
```js
Components.utils.import('chrome://mods/content/firefox-mods/js/main.js');
```

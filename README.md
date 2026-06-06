# Didar Tools

A background-only browser extension for Didar CRM.

## Install on Firefox

1. Download or clone this repository to your computer.
2. Open Firefox and go to:

   ```text
   about:debugging#/runtime/this-firefox
   ```

3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file inside this project folder.
5. Didar Tools should now be loaded temporarily in Firefox.

Firefox temporary add-ons are removed when Firefox restarts. After each restart, load `manifest.json` again from `about:debugging#/runtime/this-firefox`.

## Install on Chrome

1. Download or clone this repository to your computer.
2. Keep the project folder somewhere permanent. Chrome loads the extension directly from this folder, so do not delete or move it after installation.
3. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

4. Turn on **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the Didar Tools Extension project folder, the folder that contains `manifest.json`.
7. Didar Tools should now appear in your extensions list.

Didar Tools has no popup or extension window. It works in the background on `https://app.didar.me`.

## How to Update

Because Didar Tools is installed manually, the browser will not update it from an extension store.

To update it:

1. Download or pull the latest version of this repository.
2. Open:

   ```text
   chrome://extensions
   ```

3. Find **Didar Tools**.
4. Click the reload button on the extension card.

If you moved the project folder, remove Didar Tools and install it again.

## Troubleshooting

### "Manifest file is missing or unreadable"

You selected the wrong folder. Choose the folder that directly contains `manifest.json`.

### "This extension may have been corrupted"

Remove Didar Tools from `chrome://extensions`, download a fresh copy of the project, and load it again with **Load unpacked**.

### Didar Tools disappeared after moving files

Chrome loads unpacked extensions from their original folder path. Move the folder back, or remove and reinstall Didar Tools Extension from the new location.

### Changes are not showing

Open `chrome://extensions`, find Didar Tools, and click the reload button on its extension card.

### The extension icon is missing

Make sure the `icons/` folder exists and contains the icon files referenced by `manifest.json`.

# Tempo Panel Manager for Mozilla Browsers

Mozilla-based browser implementation of the Tempo Panel Manager extension. Compatible with Firefox, Zen, LibreWolf, Floorp, and other Mozilla-based browsers.

## Installation Instructions

### Manual Installation (Temporary Add-on)
1. Download or clone this repository
2. Open your Mozilla-based browser and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select any file in the `mozilla` folder from this repository
5. Verify the extension appears in your toolbar

Note: Temporarily loaded add-ons will be removed when the browser is restarted.

### Creating a Signed XPI (For Developers)
To create a persistent installation:
1. Create an account on [addons.mozilla.org](https://addons.mozilla.org/)
2. Use the `web-ext` tool to build and sign the extension
   - Install: `npm install -g web-ext`
   - Build: `web-ext build -s mozilla/`
   - Sign: `web-ext sign -s mozilla/ --api-key=[YOUR API KEY] --api-secret=[YOUR API SECRET]`

## Features

- **Chat Panel**: Open just the Tempo chat interface in a dedicated window
- **Canvas Panel**: Open just the Tempo canvas in a dedicated window
- **Popup Blocking Detection**: Clear messages if popups are blocked
- **Visual Feedback**: Status indicators when panels are successfully loaded

## Usage

1. Navigate to a Tempo canvas page (e.g., `https://app.tempo.new/canvases/...`)
2. Click the Tempo icon in your browser's toolbar
3. Select the desired panel to open in a separate window

## Troubleshooting

### Popup Blockers
If the extension isn't able to create new windows:
1. Look for the popup blocked icon in the address bar
2. Click it and select "Allow popups from app.tempo.new"
3. Try again

## Development Notes

If you want to modify this extension while it's temporarily loaded:
1. Make your code changes
2. Return to `about:debugging#/runtime/this-firefox`
3. Click "Reload" on the Tempo Panel Manager entry
4. Test your changes

## Credits

Built with ♥ by [Ramon Claudio](https://github.com/ramonclaudio).

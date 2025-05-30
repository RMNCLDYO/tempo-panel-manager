# Tempo Panel Manager for Chrome

![Tempo Logo](icon_128.png)

Chrome-specific implementation of the Tempo Panel Manager extension.

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select the `chrome` folder from this repository
6. Verify the extension appears in your toolbar

## Features

- **Chat Panel**: Open just the Tempo chat interface in a dedicated window
- **Canvas Panel**: Open just the Tempo canvas in a dedicated window
- **Popup Blocking Detection**: Clear messages if popups are blocked
- **Visual Feedback**: Status indicators when panels are successfully loaded

## Usage

1. Navigate to a Tempo canvas page (e.g., `https://app.tempo.new/canvases/...`)
2. Click the Tempo icon in your Chrome toolbar
3. Select the desired panel to open in a separate window

## Troubleshooting

### Popup Blockers
If the extension isn't able to create new windows:
1. Look for the popup blocked icon in the address bar
2. Click it and select "Always allow popups from app.tempo.new"
3. Try again

## Development Notes

If you want to modify this extension:
1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Tempo Panel Manager card
4. Test your changes

## Credits

Built with ♥ by [RMNCLDYO](https://github.com/rmncldyo).

# X.com Word Muter

A Chrome extension that allows you to quickly mute words on X.com (formerly Twitter) with just a right-click. No more navigating through settings menus - simply select text, right-click, and mute!

![Extension Demo](docs/demo.gif)

## Features

- 🎯 Right-click to mute any selected word on X.com
- ⚡ Fast and seamless muting process
- 🔔 Automatic notification settings configuration
- 🎨 Clean and intuitive interface
- 🔒 Minimal permissions required

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/x-mute.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Visit X.com
2. Select any word you want to mute
3. Right-click and select "Mute word [selected text] on X.com"
4. The extension will automatically:
   - Navigate to the muted words settings
   - Fill in the word
   - Configure optimal muting settings
   - Save the changes
   - Close the tab

## Privacy & Permissions

This extension requires minimal permissions:
- `contextMenus`: For the right-click menu functionality
- `tabs`: To open and manage the muting process
- `storage`: To temporarily store the word being muted
- `notifications`: To confirm when a word has been muted
- Host permissions for `x.com` and `twitter.com`

No data is collected or transmitted outside of X.com.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the X.com developer community for their documentation
- Icon made by [Your Icon Source] from [www.example.com]

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/x-mute/issues) on GitHub. 
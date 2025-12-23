# Icons Required

The extension needs three icon files to function. Please create and add these PNG files to this `icons/` folder:

## Required Icon Files

1. **icon16.png** - 16x16 pixels
   - Used in: Extension toolbar
   - Format: PNG with transparency

2. **icon48.png** - 48x48 pixels
   - Used in: Extension management page
   - Format: PNG with transparency

3. **icon128.png** - 128x128 pixels
   - Used in: Chrome Web Store listing, installation dialog
   - Format: PNG with transparency

## Design Guidelines

- **Style**: Simple, recognizable YouNote logo/icon
- **Colors**: Match YouNote brand colors
- **Background**: Transparent (PNG with alpha channel)
- **Content**: Should be clear at small sizes (16px)

## Quick Options

### Option 1: Use Existing Logo
If you have a YouNote logo, resize it to these three sizes.

### Option 2: Simple Design
Create a simple icon with:
- A notepad/paper icon
- YouTube play button
- Or combine both elements

### Option 3: Text-Based
Use "YN" initials with a colored background

## Tools for Creating Icons

- **Online**: [Figma](https://figma.com), [Canva](https://canva.com)
- **Software**: Adobe Illustrator, Photoshop, Sketch
- **Free**: GIMP, Inkscape
- **Quick**: Use emoji or simple shapes

## Example Code to Generate Simple Icons (SVG → PNG)

You can use online tools like [svgtopng.com](https://svgtopng.com) or [cloudconvert.com](https://cloudconvert.com) to convert SVG to PNG at the required sizes.

## Testing

After adding icons:
1. Reload extension in Chrome (`chrome://extensions/`)
2. Check that extension icon appears in toolbar
3. Verify icon looks good at small size (16px)

## Note

The extension will NOT load without these icon files! Chrome requires at least one icon to be specified in the manifest.

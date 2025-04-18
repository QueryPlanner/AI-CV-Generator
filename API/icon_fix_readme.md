# RenderCV Icon Rendering Fix

This guide will help you fix the issue with missing icons in your RenderCV PDFs.

## Problem
RenderCV uses icon fonts (like Font Awesome) to render icons for GitHub, email, location, etc. If these fonts are not installed or accessible to the Typst compiler, the icons won't display in your PDFs.

## Solution

### Step 1: Install Font Awesome
Run the setup script to download and install Font Awesome:

```bash
cd API
python setup_fonts.py
```

This will download Font Awesome and set up the necessary font files in a `fonts` directory.

### Step 2: Set the Font Path Environment Variable
After the setup script completes, it will show you the path to the fonts directory. Set this as an environment variable:

```bash
export RENDERCV_FONT_PATH=/path/to/fonts
```

### Step 3: Restart the Flask API Server
Make sure you restart the Flask API server to apply the changes:

```bash
python API/app.py
```

### Step 4: Test Icon Rendering
To check if the icons are now rendering correctly, use the test script:

```bash
python API/test_icons.py
```

This will generate a test PDF with icons and open it for visual inspection.

## Testing in the Next.js Frontend

To check if icons work in the Next.js frontend, use the Node.js test script:

```bash
cd API
node check_frontend.js
```

This will:
1. Check if the Next.js app is configured to use your API
2. Test if the API is running and can render PDFs with icons
3. Verify if the frontend has the necessary dependencies to display PDFs

Follow any advice from the test script to fix integration issues.

## Troubleshooting

### Icons Still Not Showing

If icons still don't appear after following these steps:

1. Ensure the YAML configuration has `use_icons_for_connections: true` in the `design.header` section
2. Verify that Typst is installed and can access the font directory
3. Check the Flask server logs for any warnings about missing fonts
4. Make sure the PDF viewer in your browser or application supports displaying embedded fonts

### Common Issues

- **Wrong Font Path**: Double-check the RENDERCV_FONT_PATH environment variable points to the correct directory
- **Missing Font Files**: Run `setup_fonts.py` again to reinstall the font files
- **Typst Configuration**: If using a custom Typst installation, make sure it's configured to use system fonts
- **Frontend Integration**: Make sure your Next.js app is correctly configured to call the API endpoint

### Checking Logs

Look for these log messages in the Flask server output:

- "Added font path: [path]" - Confirms the font path was added to the Typst command
- "Available fonts in RenderCV assets directory:" - Lists detected font files
- "No icon fonts detected" - Warning that indicates no icon fonts were found

## Next Steps

If you need further help, check the RenderCV documentation about icon configuration:
https://docs.rendercv.com/design/header

Remember that the font installation only needs to be done once, but the environment variable needs to be set each time you start the Flask server (or added to your shell profile). 
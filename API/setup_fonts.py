#!/usr/bin/env python3
"""
Setup script for downloading and installing icon fonts for RenderCV.

This script downloads Font Awesome and sets it up for use with RenderCV and Typst.
Run this script before starting the Flask app to ensure icons render correctly.
"""

import os
import sys
import shutil
import tempfile
import subprocess
import zipfile
from pathlib import Path
import urllib.request

# Font URLs
# Changed URL to GitHub releases which allows direct downloads
FONT_AWESOME_URL = "https://github.com/FortAwesome/Font-Awesome/releases/download/6.4.2/fontawesome-free-6.4.2-web.zip"

def download_file(url, output_path):
    """Download a file from a URL to the specified output path."""
    print(f"Downloading {url} to {output_path}...")
    try:
        # Add a user agent to avoid 403 errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(output_path, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def extract_zip(zip_path, extract_to):
    """Extract a zip file to the specified directory."""
    print(f"Extracting {zip_path} to {extract_to}...")
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        return True
    except Exception as e:
        print(f"Error extracting {zip_path}: {e}")
        return False

def setup_font_awesome():
    """Download and set up Font Awesome."""
    # Create temp directory for download
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_path = os.path.join(temp_dir, "fontawesome.zip")
        
        # Download Font Awesome
        if not download_file(FONT_AWESOME_URL, zip_path):
            # Try alternative download URL as fallback
            fallback_url = "https://use.fontawesome.com/releases/v6.4.2/fontawesome-free-6.4.2-web.zip"
            print(f"Trying alternative URL: {fallback_url}")
            if not download_file(fallback_url, zip_path):
                print("Both download attempts failed. Trying npm as a last resort...")
                return setup_font_awesome_npm()
        
        # Extract zip
        if not extract_zip(zip_path, temp_dir):
            return False
        
        # Find the webfonts directory (different structure in web package)
        fa_dir = next(Path(temp_dir).glob("fontawesome*"))
        webfonts_dir = fa_dir / "webfonts"
        
        if not webfonts_dir.exists():
            print(f"Error: Could not find webfonts directory in extracted Font Awesome")
            return False
        
        # Create fonts directory
        fonts_dir = Path("fonts")
        fonts_dir.mkdir(exist_ok=True)
        
        # Copy font files (various formats)
        font_files_copied = 0
        for font_file in webfonts_dir.glob("fa-*"):
            dest_file = fonts_dir / font_file.name
            print(f"Copying {font_file} to {dest_file}")
            shutil.copy2(font_file, dest_file)
            font_files_copied += 1
        
        if font_files_copied == 0:
            print("No font files were copied!")
            return False
            
        print(f"Font Awesome setup complete! Copied {font_files_copied} font files.")
        return True

def setup_font_awesome_npm():
    """Alternative approach to install Font Awesome using npm."""
    print("Attempting to install Font Awesome using npm...")
    try:
        # Create a temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Change to the temp directory
            original_dir = os.getcwd()
            os.chdir(temp_dir)
            
            # Initialize package.json
            subprocess.run(["npm", "init", "-y"], check=True, capture_output=True)
            
            # Install Font Awesome
            subprocess.run(["npm", "install", "@fortawesome/fontawesome-free"], check=True)
            
            # Copy font files
            fa_path = Path(temp_dir) / "node_modules" / "@fortawesome" / "fontawesome-free" / "webfonts"
            
            if not fa_path.exists():
                print(f"Error: npm installed Font Awesome but can't find webfonts directory at {fa_path}")
                os.chdir(original_dir)
                return False
                
            # Create fonts directory
            fonts_dir = Path(original_dir) / "fonts"
            fonts_dir.mkdir(exist_ok=True)
            
            # Copy font files
            font_files_copied = 0
            for font_file in fa_path.glob("fa-*"):
                dest_file = fonts_dir / font_file.name
                print(f"Copying {font_file} to {dest_file}")
                shutil.copy2(font_file, dest_file)
                font_files_copied += 1
                
            os.chdir(original_dir)
            
            if font_files_copied == 0:
                print("No font files were copied from npm package!")
                return False
                
            print(f"Font Awesome setup via npm complete! Copied {font_files_copied} font files.")
            return True
    except Exception as e:
        print(f"Error setting up Font Awesome via npm: {e}")
        if 'original_dir' in locals():
            os.chdir(original_dir)
        return False

def download_from_cdn():
    """Download individual font files directly from CDN as a last resort."""
    print("Attempting to download individual font files from CDN...")
    
    # Create fonts directory
    fonts_dir = Path("fonts")
    fonts_dir.mkdir(exist_ok=True)
    
    # List of CDN URLs for common icon fonts
    cdn_urls = [
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-brands-400.ttf",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-regular-400.ttf",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-solid-900.ttf",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-brands-400.woff2",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-regular-400.woff2",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-solid-900.woff2",
    ]
    
    success = False
    for url in cdn_urls:
        filename = url.split("/")[-1]
        output_path = fonts_dir / filename
        if download_file(url, output_path):
            success = True
            
    return success

def main():
    print("Setting up fonts for RenderCV...")
    
    # Setup Font Awesome
    if not setup_font_awesome():
        print("Primary Font Awesome setup method failed.")
        print("Trying to download individual font files from CDN...")
        if not download_from_cdn():
            print("All download methods failed. Please install Font Awesome manually.")
            print("\nManual installation instructions:")
            print("1. Download Font Awesome from https://fontawesome.com/download")
            print("2. Extract the ZIP file")
            print("3. Copy all files from the 'webfonts' directory to a 'fonts' directory in your project")
            print("4. Set the RENDERCV_FONT_PATH environment variable to point to this directory")
            return 1
    
    # Set environment variable for the Flask app
    fonts_dir = os.path.abspath("fonts")
    print(f"\nSetup complete! Font files installed to: {fonts_dir}")
    print(f"To use these fonts with the Flask app, set this environment variable:")
    print(f"export RENDERCV_FONT_PATH={fonts_dir}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 
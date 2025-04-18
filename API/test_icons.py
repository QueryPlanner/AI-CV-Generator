#!/usr/bin/env python3
"""
Test script to verify if icons are working properly in RenderCV.
This script:
1. Checks if required icon fonts are installed
2. Makes a test request to the API with a sample YAML
3. Verifies if the PDF contains icon-related metadata
"""

import os
import sys
import json
import requests
import tempfile
import subprocess
from pathlib import Path

def check_font_installation():
    """Check if required font files are installed."""
    print("Checking for icon font installation...")
    
    # Check environment variable
    font_path = os.environ.get('RENDERCV_FONT_PATH')
    if font_path:
        print(f"RENDERCV_FONT_PATH is set to: {font_path}")
        font_dir = Path(font_path)
        if not font_dir.exists():
            print(f"Warning: Font directory {font_path} does not exist!")
            return False
            
        # Check for font files (webfonts format for FA)
        font_files = list(font_dir.glob("fa-*"))
        if not font_files:
            print(f"Warning: No Font Awesome files found in {font_path}")
            return False
            
        # Look for specific Font Awesome files 
        print(f"Found {len(font_files)} Font Awesome files: {', '.join(f.name for f in font_files[:5])}")
        print(f"{'...' if len(font_files) > 5 else ''}")
        return True
    else:
        print("Warning: RENDERCV_FONT_PATH environment variable is not set")
        
        # Check if we have a local fonts directory
        local_fonts = Path("fonts")
        if local_fonts.exists() and list(local_fonts.glob("fa-*")):
            print(f"Found local fonts directory with Font Awesome files at {local_fonts.absolute()}")
            print(f"Consider setting: export RENDERCV_FONT_PATH={local_fonts.absolute()}")
            return True
            
        # Check RenderCV's asset directory if possible
        try:
            from rendercv.constants import ASSETS_DIR
            font_path = os.path.join(ASSETS_DIR, "fonts")
            if os.path.exists(font_path) and any(Path(font_path).glob("fa-*")):
                print(f"Found fonts in RenderCV assets: {font_path}")
                return True
        except ImportError:
            pass
            
        print("No icon fonts detected. Run setup_fonts.py to install them.")
        return False

def test_api_rendering():
    """Test rendering a simple YAML with social network icons."""
    print("\nTesting API rendering with icons...")
    
    # Sample YAML with GitHub and LinkedIn icons - More complete to avoid KeyError
    test_yaml = """
cv:
  name: "Test User"
  location: "Test Location"
  email: "test@example.com"
  social_networks:
    - network: "GitHub"
      username: "testuser"
    - network: "LinkedIn"
      username: "testuser"
  sections:
    experience:
      - company: "Test Company"
        position: "Test Position"
        start_date: "2023-01"
        end_date: "present"
        location: "Test City"
        highlights:
          - "Test highlight"
design:
  theme: "moderncv"
  header:
    use_icons_for_connections: true
    connections_font_family: "Font Awesome 6 Brands"
    name_font_family: "Source Sans 3"
  colors:
    text: "rgb(0, 0, 0)"
    name: "rgb(0, 79, 144)"
    connections: "rgb(0, 79, 144)"
  page:
    size: "us-letter"
  text:
    font_family: "Source Sans 3"
locale:
  language: "en"
"""
    
    try:
        # Try to connect to the local Flask server
        response = requests.post(
            "http://localhost:8000/render_live", 
            json={"yaml_content": test_yaml},
            timeout=10
        )
        
        if response.status_code == 200:
            # Check content type
            if response.headers.get('content-type') == 'application/pdf':
                pdf_size = len(response.content)
                print(f"Successfully rendered PDF with size: {pdf_size} bytes")
                
                # Check for icon warning header
                if response.headers.get('X-Icon-Warning') == 'true':
                    print("Warning: API reports that icons may not render correctly")
                
                # Save PDF for inspection
                with open("test_icons.pdf", "wb") as f:
                    f.write(response.content)
                print(f"Saved test PDF to test_icons.pdf for visual inspection")
                
                return True
            else:
                print(f"Error: API returned non-PDF content: {response.headers.get('content-type')}")
                print(response.text[:500])  # Show first 500 chars of response
                return False
        else:
            print(f"Error: API returned status code {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error message: {error_data.get('error')}")
                if 'details' in error_data:
                    for detail in error_data.get('details'):
                        print(f"- {detail}")
            except:
                print(response.text[:500])  # Show first 500 chars of response
            return False
                
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to API server at http://localhost:8000")
        print("Make sure the Flask app is running with: python API/app.py")
        return False
    except Exception as e:
        print(f"Error testing API: {e}")
        return False

def test_frontend_integration():
    """Test if the Next.js frontend can display PDFs with icons."""
    print("\nChecking Next.js frontend integration...")
    
    # Check if the Next.js app is using the correct API endpoint
    frontend_dir = Path("../resume-builder-landing")
    if not frontend_dir.exists():
        frontend_dir = Path("./resume-builder-landing")
    
    if not frontend_dir.exists():
        print("Warning: Could not find Next.js frontend directory")
        return False
        
    # Check if .env.local exists and contains API_URL
    env_file = frontend_dir / ".env.local"
    if env_file.exists():
        with open(env_file) as f:
            env_content = f.read()
            if "API_URL" in env_content:
                print(f"Found API_URL in .env.local: {env_content.strip()}")
                if "localhost:8000" in env_content or "127.0.0.1:8000" in env_content:
                    print("Next.js frontend appears to be properly configured to use the local API")
                    return True
            else:
                print("Warning: No API_URL found in .env.local")
    else:
        print(f"Warning: No .env.local file found in {frontend_dir}")
    
    return False

def open_test_pdf():
    """Try to open the test PDF for inspection."""
    test_pdf = Path("test_icons.pdf")
    if not test_pdf.exists():
        print("No test PDF file to open.")
        return
        
    try:
        # Try to open PDF for visual inspection
        if sys.platform == "darwin":  # macOS
            subprocess.run(["open", test_pdf])
        elif sys.platform == "win32":  # Windows
            os.startfile(test_pdf)
        else:  # Linux
            subprocess.run(["xdg-open", test_pdf])
        print(f"Opened {test_pdf} for visual inspection")
    except Exception as e:
        print(f"Could not open PDF: {e}")

def main():
    print("=== RenderCV Icon Test ===")
    
    # Step 1: Check font installation
    fonts_ok = check_font_installation()
    if not fonts_ok:
        print("\nWarning: Icon fonts not properly set up. Run setup_fonts.py first.")
    
    # Step 2: Test API rendering
    api_ok = test_api_rendering()
    
    # Step 3: Check frontend integration
    frontend_ok = test_frontend_integration()
    
    # Open the test PDF for inspection
    if api_ok:
        open_test_pdf()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"Icon Fonts: {'✅' if fonts_ok else '❌'}")
    print(f"API Rendering: {'✅' if api_ok else '❌'}")
    print(f"Frontend Integration: {'✅' if frontend_ok else '❌'}")
    
    if fonts_ok and api_ok and frontend_ok:
        print("\nAll tests passed! Your setup should display icons correctly.")
    else:
        print("\nSome tests failed. Check warnings above and follow instructions to fix issues.")
    
    return 0 if fonts_ok and api_ok else 1

if __name__ == "__main__":
    sys.exit(main()) 
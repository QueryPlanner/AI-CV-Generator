#!/usr/bin/env python3
"""
Test script to verify Typst's direct Font Awesome support
"""

import os
import sys
import subprocess
from pathlib import Path

def test_typst_font_awesome():
    """Test direct Typst compilation with Font Awesome."""
    print("=== Testing Typst Font Awesome Support ===")
    
    # Check if environment variable is set
    font_path = os.environ.get('RENDERCV_FONT_PATH')
    if not font_path:
        print("Warning: RENDERCV_FONT_PATH not set, using current directory")
        font_path = os.path.join(os.getcwd(), "fonts")
    
    print(f"Using font path: {font_path}")
    
    # Check if the font directory exists and has Font Awesome files
    if not os.path.exists(font_path):
        print(f"Error: Font directory not found: {font_path}")
        return False
        
    # List font files
    font_files = [f for f in os.listdir(font_path) if f.startswith('fa-')]
    if not font_files:
        print(f"Error: No Font Awesome files found in {font_path}")
        return False
        
    print(f"Found {len(font_files)} Font Awesome files: {', '.join(font_files[:5])}")
    if len(font_files) > 5:
        print("...")
    
    # Test file path
    test_file = Path("test_font_awesome.typ")
    if not test_file.exists():
        print(f"Error: Test file not found: {test_file}")
        return False
    
    # Output PDF path
    output_pdf = Path("font_awesome_test.pdf")
    
    # Compile the test file
    print("\nCompiling test file...")
    cmd = [
        "typst", "compile",
        "--font-path", font_path,
        # Typst doesn't support --with-system-fonts; use the opposite if needed
        # "--ignore-system-fonts",
        str(test_file), str(output_pdf)
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    
    # Run the command
    try:
        process = subprocess.run(cmd, capture_output=True, text=True)
        
        if process.returncode == 0:
            print(f"Successfully compiled to {output_pdf}")
            
            # Open the PDF
            try:
                if sys.platform == "darwin":  # macOS
                    subprocess.run(["open", output_pdf])
                elif sys.platform == "win32":  # Windows
                    os.startfile(output_pdf)
                else:  # Linux
                    subprocess.run(["xdg-open", output_pdf])
                print(f"Opened {output_pdf} for inspection")
            except Exception as e:
                print(f"Could not open PDF: {e}")
                
            return True
        else:
            print(f"Error compiling test file. Return code: {process.returncode}")
            print(f"STDOUT: {process.stdout}")
            print(f"STDERR: {process.stderr}")
            return False
    except Exception as e:
        print(f"Error running typst command: {e}")
        return False

if __name__ == "__main__":
    success = test_typst_font_awesome()
    sys.exit(0 if success else 1) 
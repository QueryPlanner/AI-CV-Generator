#!/usr/bin/env python3
"""
Script to fix FontAwesome icons in RenderCV moderncv template
"""

import os
import sys
import shutil
from pathlib import Path

# Map of icon names to Font Awesome Unicode values
ICON_MAP = {
    'email': '\\uf0e0',         # envelope
    'phone': '\\uf095',         # phone
    'website': '\\uf0ac',       # globe
    'location': '\\uf3c5',      # map-marker-alt
    'github': '\\uf09b',        # github
    'linkedin': '\\uf08c',      # linkedin
    'twitter': '\\uf099',       # twitter
    'facebook': '\\uf09a',      # facebook
    'instagram': '\\uf16d',     # instagram
    'scholar': '\\uf19d',       # graduation-cap
}

def backup_file(file_path):
    """Create a backup of the file"""
    backup_path = f"{file_path}.bak"
    if not os.path.exists(backup_path):
        shutil.copy2(file_path, backup_path)
        print(f"Created backup at {backup_path}")
    return backup_path

def fix_rendercv_icons():
    """Fix the icons in RenderCV templates"""
    # Path to venv site-packages
    rendercv_dir = Path("./venv/lib/python3.13/site-packages/rendercv")
    
    if not rendercv_dir.exists():
        print(f"RenderCV directory not found at {rendercv_dir}")
        return False
    
    # Header file with icons
    moderncv_header = rendercv_dir / "themes" / "moderncv" / "Header.j2.typ"
    
    if not moderncv_header.exists():
        print(f"modernCV header file not found at {moderncv_header}")
        return False
    
    # Create backup
    backup_file(moderncv_header)
    
    # Read the header file
    with open(moderncv_header, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already patched
    if "# PATCHED FOR DIRECT FONT AWESOME ICONS" in content:
        print("Header file already patched")
        return True
    
    # Add font name definitions at the top
    fa_setup = """
// PATCHED FOR DIRECT FONT AWESOME ICONS
#let fa-brands-fonts = ("fa-brands-400", "Font Awesome 6 Brands")
#let fa-solid-fonts = ("fa-solid-900", "Font Awesome 6 Free Solid")
#let fa-regular-fonts = ("fa-regular-400", "Font Awesome 6 Free")

// Function to render a Font Awesome icon correctly
#let fa-icon(name, size: 1em) = {
  let icon_code = none
  let font_family = fa-solid-fonts
  
  if name == "email" { icon_code = "\\uf0e0" }
  else if name == "phone" { icon_code = "\\uf095" }
  else if name == "website" { icon_code = "\\uf0ac" }
  else if name == "location" { icon_code = "\\uf3c5" }
  else if name == "github" { icon_code = "\\uf09b"; font_family = fa-brands-fonts }
  else if name == "linkedin" { icon_code = "\\uf08c"; font_family = fa-brands-fonts }
  else if name == "twitter" { icon_code = "\\uf099"; font_family = fa-brands-fonts }
  else if name == "facebook" { icon_code = "\\uf09a"; font_family = fa-brands-fonts }
  else if name == "instagram" { icon_code = "\\uf16d"; font_family = fa-brands-fonts }
  else if name == "scholar" { icon_code = "\\uf19d" }
  
  if icon_code != none {
    text(font: font_family, size: size)[#icon_code]
  } else {
    text(size: size)[?]
  }
}
"""
    
    # Add the patch at the beginning of the file
    patched_content = fa_setup + content
    
    # Save the patched content
    with open(moderncv_header, 'w', encoding='utf-8') as f:
        f.write(patched_content)
    
    print(f"Successfully patched {moderncv_header}")
    return True

if __name__ == "__main__":
    print("=== Fixing RenderCV FontAwesome Icons ===")
    if fix_rendercv_icons():
        print("Fix applied successfully!")
    else:
        print("Failed to apply fix. Check error messages above.") 
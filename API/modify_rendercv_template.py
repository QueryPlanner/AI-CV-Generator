#!/usr/bin/env python3
"""
Script to modify RenderCV templates to use Font Awesome icons directly
"""

import os
import sys
import re
import shutil
import tempfile
from pathlib import Path

try:
    from rendercv.constants import ASSETS_DIR, TEMPLATES_DIR
    RENDERCV_INSTALLED = True
except ImportError:
    RENDERCV_INSTALLED = False
    ASSETS_DIR = None
    TEMPLATES_DIR = None

# Map of social networks to Font Awesome Unicode values
SOCIAL_ICON_MAP = {
    'github': '\\uf09b',        # GitHub
    'linkedin': '\\uf08c',      # LinkedIn
    'twitter': '\\uf099',       # Twitter
    'facebook': '\\uf09a',      # Facebook
    'instagram': '\\uf16d',     # Instagram
    'email': '\\uf0e0',         # Envelope
    'phone': '\\uf095',         # Phone
    'location': '\\uf3c5',      # Map marker
    'website': '\\uf0ac',       # Globe
}

def get_rendercv_paths():
    """
    Get paths to RenderCV templates and assets
    """
    if not RENDERCV_INSTALLED:
        print("RenderCV not installed. Trying to find paths...")
        # Try to find paths using Python module search path
        import site
        for site_path in site.getsitepackages():
            rendercv_path = os.path.join(site_path, 'rendercv')
            if os.path.exists(rendercv_path):
                templates_dir = os.path.join(rendercv_path, 'templates')
                assets_dir = os.path.join(rendercv_path, 'assets')
                if os.path.exists(templates_dir) and os.path.exists(assets_dir):
                    return templates_dir, assets_dir
                    
        # Not found in site packages, try user's home directory
        try:
            import subprocess
            result = subprocess.run(
                [sys.executable, "-m", "pip", "show", "rendercv"], 
                capture_output=True, 
                text=True
            )
            if result.returncode == 0:
                location_line = [line for line in result.stdout.split('\n') if line.startswith('Location:')]
                if location_line:
                    location = location_line[0].split(':', 1)[1].strip()
                    rendercv_path = os.path.join(location, 'rendercv')
                    if os.path.exists(rendercv_path):
                        templates_dir = os.path.join(rendercv_path, 'templates')
                        assets_dir = os.path.join(rendercv_path, 'assets')
                        if os.path.exists(templates_dir) and os.path.exists(assets_dir):
                            return templates_dir, assets_dir
        except Exception as e:
            print(f"Error finding RenderCV using pip: {e}")
                
        print("Could not find RenderCV installation. Using current directory.")
        return None, None
    
    return TEMPLATES_DIR, ASSETS_DIR

def backup_file(file_path):
    """Create a backup of the file"""
    backup_path = f"{file_path}.bak"
    if not os.path.exists(backup_path):
        shutil.copy2(file_path, backup_path)
        print(f"Created backup at {backup_path}")
    return backup_path

def modify_template_file(file_path):
    """
    Modify a template file to use Font Awesome Unicode values directly
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        return False
        
    print(f"Modifying template: {file_path}")
    
    # Create a backup
    backup_file(file_path)
    
    # Read the content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it's already modified
    if "// Modified for direct Font Awesome icons" in content:
        print(f"File already modified: {file_path}")
        return True
    
    # Add marker and font fallback definitions
    font_defs = """
// Modified for direct Font Awesome icons
#let fa-brands = ("fa-brands-400", "Font Awesome 6 Brands", "FontAwesome6Brands-Regular")
#let fa-solid = ("fa-solid-900", "Font Awesome 6 Free Solid", "FontAwesome6Free-Solid")
#let fa-regular = ("fa-regular-400", "Font Awesome 6 Free Regular", "FontAwesome6Free-Regular")
"""
    
    # Find where to insert the definitions (after imports)
    import_pattern = r'(#import .+?\n)'
    match = re.search(import_pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + font_defs + content[insert_pos:]
    else:
        # If no imports found, add at the top
        content = font_defs + content
    
    # Replace icon patterns
    # Specifically looking for header section with connections (social media)
    replaced = False
    
    # Find if we're using connections
    if "use_icons_for_connections" in content:
        # Replace the connection definitions to use our direct Font Awesome method
        for icon_name, unicode_value in SOCIAL_ICON_MAP.items():
            # Common icon patterns in RenderCV templates
            patterns = [
                # Pattern for typical social media icons
                (fr'icon\(["\']?{icon_name}["\']?\)', f'text(font: fa-brands)["{unicode_value}"]'),
                # Pattern for email, phone, location
                (fr'icon\(["\']?{icon_name}["\']?\)', f'text(font: fa-solid)["{unicode_value}"]'),
            ]
            
            for pattern, replacement in patterns:
                if re.search(pattern, content):
                    content = re.sub(pattern, replacement, content)
                    replaced = True
                    print(f"Replaced {icon_name} icon")
    
    if not replaced:
        print(f"No icons found in the template to replace")
        return False
    
    # Save the modified content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Successfully modified {file_path}")
    return True

def modify_all_templates():
    """Modify all RenderCV templates"""
    templates_dir, _ = get_rendercv_paths()
    if not templates_dir:
        return False
    
    print(f"Searching for templates in {templates_dir}")
    template_files = []
    
    # Find all .typ files in the templates directory
    for root, _, files in os.walk(templates_dir):
        for file in files:
            if file.endswith('.typ'):
                template_files.append(os.path.join(root, file))
    
    if not template_files:
        print("No template files found")
        return False
    
    print(f"Found {len(template_files)} template files")
    
    # Modify each template
    success = 0
    for template_file in template_files:
        if modify_template_file(template_file):
            success += 1
    
    print(f"Successfully modified {success} of {len(template_files)} templates")
    return success > 0

if __name__ == "__main__":
    print("=== RenderCV Template Modifier for Font Awesome Icons ===")
    
    if len(sys.argv) > 1:
        # Modify a specific template file
        file_path = sys.argv[1]
        if os.path.exists(file_path):
            modify_template_file(file_path)
        else:
            print(f"File not found: {file_path}")
    else:
        # Modify all templates
        modify_all_templates() 
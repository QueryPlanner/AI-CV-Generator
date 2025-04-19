import os
import yaml
from pathlib import Path

# Path to theme templates
THEMES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates', 'themes')

def get_available_themes():
    """
    Returns a list of available theme names by checking for .yaml files in the themes directory.
    
    Returns:
        list: List of theme names (without the .yaml extension)
    """
    themes = []
    themes_path = Path(THEMES_DIR)
    
    if themes_path.exists():
        for file in themes_path.glob('*.yaml'):
            themes.append(file.stem)
    
    # Always include these built-in themes if not already in the list
    builtin_themes = ['classic', 'moderncv', 'sb2nov', 'engineeringclassic']
    for theme in builtin_themes:
        if theme not in themes and Path(THEMES_DIR, f"{theme}.yaml").exists():
            themes.append(theme)
    
    return sorted(themes)

def get_theme_content(theme_name):
    """
    Gets the YAML content for a specified theme.
    
    Args:
        theme_name (str): Name of the theme to load
        
    Returns:
        str: YAML content of the theme or None if not found
    """
    theme_path = os.path.join(THEMES_DIR, f"{theme_name}.yaml")
    
    if os.path.exists(theme_path):
        try:
            with open(theme_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            print(f"Error reading theme file {theme_path}: {e}")
            return None
    else:
        print(f"Theme file not found: {theme_path}")
        return None

def save_theme(theme_name, yaml_content):
    """
    Saves a theme's YAML content to file.
    
    Args:
        theme_name (str): Name of the theme
        yaml_content (str): YAML content to save
        
    Returns:
        bool: True if saved successfully, False otherwise
    """
    try:
        # Ensure themes directory exists
        os.makedirs(THEMES_DIR, exist_ok=True)
        
        # Validate YAML before saving
        yaml.safe_load(yaml_content)
        
        # Make sure the theme name is properly reflected in the content
        content_dict = yaml.safe_load(yaml_content)
        if 'design' in content_dict and 'theme' in content_dict['design']:
            content_dict['design']['theme'] = theme_name
            yaml_content = yaml.dump(content_dict, default_flow_style=False)
        
        # Save the theme file
        theme_path = os.path.join(THEMES_DIR, f"{theme_name}.yaml")
        with open(theme_path, 'w', encoding='utf-8') as file:
            file.write(yaml_content)
        
        return True
    except Exception as e:
        print(f"Error saving theme {theme_name}: {e}")
        return False

def get_default_theme_content():
    """
    Returns the content of the default theme (classic if available, otherwise fallback to empty template).
    
    Returns:
        str: YAML content of the default theme
    """
    # Try to get the classic theme first
    content = get_theme_content('classic')
    if content:
        return content
    
    # Try to get the first available theme
    themes = get_available_themes()
    if themes:
        content = get_theme_content(themes[0])
        if content:
            return content
    
    # Fallback to empty template
    return """cv:
  name: "Your Name"
  location: "Your Location"
  email: "your.email@example.com"
  sections:
    education:
      - institution: "Your University"
        area: "Your Major"
        degree: "Your Degree"
        start_date: "2020-09"
        end_date: "present"
        location: "University Location"
design:
  theme: "classic"
  section_titles:
    type: "with-partial-line"
locale:
  language: "en"
rendercv_settings:
  date: "2023-01-01"
""" 
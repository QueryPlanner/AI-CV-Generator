#!/usr/bin/env python3
"""
Font Awesome icons mapper for RenderCV
This script provides mapping between RenderCV icon names and Font Awesome Unicode values
"""

# Map of social networks to Font Awesome Unicode values
SOCIAL_ICON_MAP = {
    'GitHub': '\uf09b',       # fa-github
    'LinkedIn': '\uf08c',     # fa-linkedin
    'Twitter': '\uf099',      # fa-twitter
    'Facebook': '\uf09a',     # fa-facebook
    'Instagram': '\uf16d',    # fa-instagram
    'YouTube': '\uf167',      # fa-youtube
    'Medium': '\uf23a',       # fa-medium
    'Stack Overflow': '\uf16c',  # fa-stack-overflow
    'Website': '\uf0ac',      # fa-globe
    'Email': '\uf0e0',        # fa-envelope
    'Phone': '\uf095',        # fa-phone
    'Location': '\uf3c5',     # fa-map-marker-alt
}

# Font names to try in order
FONT_AWESOME_BRANDS = [
    "Font Awesome 6 Brands",
    "FontAwesome6Brands-Regular",
    "fa-brands-400"
]

FONT_AWESOME_SOLID = [
    "Font Awesome 6 Free Solid",
    "FontAwesome6Free-Solid",
    "fa-solid-900"
]

FONT_AWESOME_REGULAR = [
    "Font Awesome 6 Free Regular",
    "FontAwesome6Free-Regular",
    "fa-regular-400"
]

def get_typst_icon_code(service_name, fallback="?"):
    """
    Get the Typst code to display an icon for a given service.
    
    Args:
        service_name: Name of service (GitHub, LinkedIn, etc.)
        fallback: What to return if icon not found
        
    Returns:
        Typst code that will display the icon
    """
    # Normalize service name (case-insensitive match)
    for key in SOCIAL_ICON_MAP:
        if service_name.lower() == key.lower():
            unicode_value = SOCIAL_ICON_MAP[key]
            
            # For network icons (GitHub, LinkedIn, etc), use Brands font
            if key in ['GitHub', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 'Medium', 'Stack Overflow']:
                font_list = FONT_AWESOME_BRANDS
            # For general icons (email, phone, etc), use Solid font
            else:
                font_list = FONT_AWESOME_SOLID
                
            # Generate Typst code with font fallbacks
            font_str = ", ".join([f'"{font}"' for font in font_list])
            return f'#text(font: ({font_str}))[{unicode_value}]'
            
    # If no match found, return fallback
    return fallback

def inject_font_awesome_import(typst_content):
    """
    Inject Font Awesome import into Typst content if needed.
    
    Args:
        typst_content: The original Typst content
        
    Returns:
        Modified Typst content with Font Awesome import
    """
    # Check if the content already has Font Awesome imports
    if "Font Awesome" in typst_content:
        return typst_content
        
    # Find the preamble position (after imports but before content)
    lines = typst_content.split("\n")
    insert_pos = 0
    
    # Find a good position after imports
    for i, line in enumerate(lines):
        if line.startswith("#import") or line.startswith("#show"):
            insert_pos = i + 1
            
    # Create Font Awesome setup lines
    fa_setup = [
        "// Font Awesome setup for icons",
        "#let fa-brands = (\"Font Awesome 6 Brands\", \"FontAwesome6Brands-Regular\", \"fa-brands-400\")",
        "#let fa-solid = (\"Font Awesome 6 Free Solid\", \"FontAwesome6Free-Solid\", \"fa-solid-900\")",
        "#let fa-regular = (\"Font Awesome 6 Free Regular\", \"FontAwesome6Free-Regular\", \"fa-regular-400\")",
        ""
    ]
    
    # Insert setup
    for line in reversed(fa_setup):
        lines.insert(insert_pos, line)
        
    return "\n".join(lines)

if __name__ == "__main__":
    # Test some icon codes
    print("GitHub icon:", get_typst_icon_code("GitHub"))
    print("LinkedIn icon:", get_typst_icon_code("LinkedIn"))
    print("Email icon:", get_typst_icon_code("Email"))
    print("Phone icon:", get_typst_icon_code("Phone")) 
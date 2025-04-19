import yaml
import re
from typing import Dict, Any, Union

def fix_yaml_validation_errors(yaml_content: str) -> str:
    """
    Automatically fixes common YAML validation errors without showing errors to the user.
    
    Args:
        yaml_content: Original YAML content with potential validation errors
        
    Returns:
        Fixed YAML content with problematic fields removed or corrected
    """
    try:
        # Parse the YAML content to a dictionary
        yaml_dict = yaml.safe_load(yaml_content)
        
        # Apply the fixes
        fixed_yaml_dict = apply_fixes(yaml_dict)
        
        # Convert back to YAML string
        fixed_yaml = yaml.dump(fixed_yaml_dict, default_flow_style=False)
        
        return fixed_yaml
    except Exception as e:
        # In case of parsing errors, try to fix the content using regex
        fixed_yaml = fix_yaml_with_regex(yaml_content)
        return fixed_yaml

def apply_fixes(yaml_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Apply fixes to the YAML dictionary representation.
    Removes or corrects fields known to cause validation errors.
    """
    if not isinstance(yaml_dict, dict):
        return yaml_dict
    
    # Fix design section if it exists
    if 'design' in yaml_dict and isinstance(yaml_dict['design'], dict):
        design = yaml_dict['design']
        
        # Fix header section
        if 'header' in design and isinstance(design['header'], dict):
            header = design['header']
            # Remove problematic header fields
            header.pop('small_caps_for_name', None)
            header.pop('use_urls_as_placeholders_for_connections', None)
            header.pop('make_connections_links', None)
        
        # Fix section_titles section
        if 'section_titles' in design and isinstance(design['section_titles'], dict):
            section_titles = design['section_titles']
            
            # Fix section_titles.type if it has an invalid value
            if 'type' in section_titles:
                valid_types = ['with-partial-line', 'with-full-line', 'without-line', 'moderncv']
                if section_titles['type'] not in valid_types:
                    # Default to a valid value
                    section_titles['type'] = 'with-partial-line'
        
        # Fix highlights section
        if 'highlights' in design and isinstance(design['highlights'], dict):
            highlights = design['highlights']
            # Remove problematic highlights fields
            highlights.pop('nested_bullet', None)
    
    # Process nested dictionaries recursively
    for key, value in yaml_dict.items():
        if isinstance(value, dict):
            yaml_dict[key] = apply_fixes(value)
        elif isinstance(value, list):
            yaml_dict[key] = [apply_fixes(item) if isinstance(item, dict) else item for item in value]
    
    return yaml_dict

def fix_yaml_with_regex(yaml_content: str) -> str:
    """
    Fix YAML content using regex patterns when direct parsing fails.
    """
    # Remove problematic header fields
    yaml_content = re.sub(r'(\s+)small_caps_for_name:\s*[^\n]+\n', r'\1', yaml_content)
    yaml_content = re.sub(r'(\s+)use_urls_as_placeholders_for_connections:\s*[^\n]+\n', r'\1', yaml_content)
    yaml_content = re.sub(r'(\s+)make_connections_links:\s*[^\n]+\n', r'\1', yaml_content)
    
    # Fix section_titles.type field
    yaml_content = re.sub(
        r'(\s+type:\s*)[\'"](?!with-partial-line|with-full-line|without-line|moderncv)[^\'"]+[\'"]', 
        r'\1"with-partial-line"', 
        yaml_content
    )
    
    # Remove problematic highlights fields
    yaml_content = re.sub(r'(\s+)nested_bullet:\s*[^\n]+\n', r'\1', yaml_content)
    
    return yaml_content 
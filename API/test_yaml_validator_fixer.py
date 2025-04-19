import unittest
import yaml
from yaml_validator_fixer import fix_yaml_validation_errors, fix_yaml_with_regex, apply_fixes

class TestYamlValidatorFixer(unittest.TestCase):
    def test_fix_yaml_validation_errors(self):
        # Test with problematic fields
        yaml_content = """
design:
  header:
    small_caps_for_name: true
    use_urls_as_placeholders_for_connections: true
    make_connections_links: true
  section_titles:
    type: 'invalid-type'
  highlights:
    nested_bullet: '>'
"""
        fixed_yaml = fix_yaml_validation_errors(yaml_content)
        
        # Parse the fixed YAML to check the results
        fixed_dict = yaml.safe_load(fixed_yaml)
        
        # Check that problematic fields are removed
        self.assertNotIn('small_caps_for_name', fixed_dict['design']['header'])
        self.assertNotIn('use_urls_as_placeholders_for_connections', fixed_dict['design']['header'])
        self.assertNotIn('make_connections_links', fixed_dict['design']['header'])
        self.assertNotIn('nested_bullet', fixed_dict['design']['highlights'])
        
        # Check that invalid values are corrected
        self.assertIn('type', fixed_dict['design']['section_titles'])
        self.assertEqual(fixed_dict['design']['section_titles']['type'], 'with-partial-line')
    
    def test_fix_yaml_with_regex(self):
        # Test regex-based fixing
        yaml_content = """
design:
  header:
    small_caps_for_name: true
    use_urls_as_placeholders_for_connections: true
    make_connections_links: true
  section_titles:
    type: 'invalid-type'
  highlights:
    nested_bullet: '>'
"""
        fixed_yaml = fix_yaml_with_regex(yaml_content)
        
        # Check that problematic fields are removed
        self.assertNotIn('small_caps_for_name:', fixed_yaml)
        self.assertNotIn('use_urls_as_placeholders_for_connections:', fixed_yaml)
        self.assertNotIn('make_connections_links:', fixed_yaml)
        self.assertNotIn('nested_bullet:', fixed_yaml)
        
        # Check that invalid values are corrected
        self.assertIn('type: "with-partial-line"', fixed_yaml)

if __name__ == '__main__':
    unittest.main() 
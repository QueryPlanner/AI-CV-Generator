import os
import uuid
import tempfile
import traceback
import io # <-- Import io
import subprocess # <-- Added import
from pathlib import Path
from flask import Flask, request, send_file, jsonify, abort, render_template_string
import yaml
from rendercv.api import create_contents_of_a_typst_file_from_a_yaml_string
from yaml_validator_fixer import fix_yaml_validation_errors, fix_yaml_with_regex
import theme_manager  # Import the theme manager module

# Ensure RenderCV and its dependencies (Typst) are installed and accessible
try:
    # Use the function to generate Typst content
    from rendercv.api import create_contents_of_a_typst_file_from_a_yaml_string
    RENDERCV_AVAILABLE = True
except ImportError:
    print("ERROR: Cannot import from rendercv.api. Is RenderCV installed?")
    create_contents_of_a_typst_file_from_a_yaml_string = None
    RENDERCV_AVAILABLE = False

app = Flask(__name__)

# --- LARGE YAML SAMPLE --- (Corrected version from previous steps)
# Replace the placeholder in HTML_TEMPLATE with this
DEFAULT_YAML_CONTENT = """
cv:
  name: "John Doe"
  location: "Location"
  email: "john.doe@example.com"
  phone: "+1-609-999-9995"
  website:
  social_networks:
    - network: "LinkedIn"
      username: "john.doe"
    - network: "GitHub"
      username: "john.doe"
  sections:
    welcome_to_RenderCV!:
      - "[RenderCV](https://rendercv.com) is a Typst-based CV framework designed for academics and engineers, with Markdown syntax support."
      - "Each section title is arbitrary. Each section contains a list of entries, and there are 7 different entry types to choose from."
    education:
      - institution: "Stanford University"
        area: "Computer Science"
        degree: "PhD"
        date:
        start_date: "2023-09"
        end_date: "present"
        location: "Stanford, CA, USA"
        summary:
        highlights:
          - "Working on the optimization of autonomous vehicles in urban environments"
      - institution: "Boğaziçi University"
        area: "Computer Engineering"
        degree: "BS"
        date:
        start_date: "2018-09"
        end_date: "2022-06"
        location: "Istanbul, Türkiye"
        summary:
        highlights:
          - "GPA: 3.9/4.0, ranked 1st out of 100 students"
          - "Awards: Best Senior Project, High Honor"
    experience:
      - company: "Company C"
        position: "Summer Intern"
        date:
        start_date: "2024-06"
        end_date: "2024-09"
        location: "Livingston, LA, USA"
        summary:
        highlights:
          - "Developed deep learning models for the detection of gravitational waves in LIGO data"
          - "Published [3 peer-reviewed research papers](https://example.com) about the project and results"
      - company: "Company B"
        position: "Summer Intern"
        date:
        start_date: "2023-06"
        end_date: "2023-09"
        location: "Ankara, Türkiye"
        summary:
        highlights:
          - "Optimized the production line by 15% by implementing a new scheduling algorithm"
      - company: "Company A"
        position: "Summer Intern"
        date:
        start_date: "2022-06"
        end_date: "2022-09"
        location: "Istanbul, Türkiye"
        summary:
        highlights:
          - "Designed an inventory management web application for a warehouse"
    projects:
      - name: "[Example Project](https://example.com)"
        date:
        start_date: "2024-05"
        end_date: "present"
        location:
        summary: "A web application for writing essays"
        highlights:
          - "Launched an [iOS app](https://example.com) in 09/2024 that currently has 10k+ monthly active users"
          - "The app is made open-source (3,000+ stars [on GitHub](https://github.com))"
      - name: "[Teaching on Udemy](https://example.com)"
        date: "Fall 2023"
        start_date:
        end_date:
        location:
        summary:
        highlights:
          - 'Instructed the "Statics" course on Udemy (60,000+ students, 200,000+ hours watched)'
    skills:
      - label: "Programming"
        details: "Proficient with Python, C++, and Git; good understanding of Web, app development, and DevOps"
      - label: "Mathematics"
        details: "Good understanding of differential equations, calculus, and linear algebra"
      - label: "Languages"
        details: "English (fluent, TOEFL: 118/120), Turkish (native)"
    publications:
      - title: "3D Finite Element Analysis of No-Insulation Coils"
        authors:
          - "Frodo Baggins"
          - "***John Doe***"
          - "Samwise Gamgee"
        doi: "10.1109/TASC.2023.3340648"
        url:
        journal:
        date: "2004-01"
    extracurricular_activities:
      - bullet: "There are 7 unique entry types in RenderCV: *BulletEntry*, *TextEntry*, *EducationEntry*, *ExperienceEntry*, *NormalEntry*, *PublicationEntry*, and *OneLineEntry*."
      - bullet: "Each entry type has a different structure and layout. This document demonstrates all of them."
    numbered_entries:
      - number: "This is a numbered entry."
      - number: "This is another numbered entry."
      - number: "This is the third numbered entry."
    reversed_numbered_entries:
      - reversed_number: "This is a reversed numbered entry."
      - reversed_number: "This is another reversed numbered entry."
      - reversed_number: "This is the third reversed numbered entry."
design:
  theme: "moderncv" # Using the theme specified in the YAML
  page:
    size: "us-letter"
    top_margin: "2cm"
    bottom_margin: "2cm"
    left_margin: "2cm"
    right_margin: "2cm"
    show_page_numbering: true
    show_last_updated_date: true
  colors:
    text: "rgb(0, 0, 0)"
    name: "rgb(0, 79, 144)"
    connections: "rgb(0, 79, 144)"
    section_titles: "rgb(0, 79, 144)"
    links: "rgb(0, 79, 144)"
    last_updated_date_and_page_numbering: "rgb(128, 128, 128)"
  text:
    font_family: "Source Sans 3"
    font_size: "10pt"
    leading: "0.6em"
    alignment: "justified"
    date_and_location_column_alignment: "right"
  links:
    underline: false
    use_external_link_icon: true
  header:
    name_font_family: "Source Sans 3"
    name_font_size: "30pt"
    name_bold: true
    photo_width: "3.5cm"
    vertical_space_between_name_and_connections: "0.7cm"
    vertical_space_between_connections_and_first_section: "0.7cm"
    horizontal_space_between_connections: "0.5cm"
    connections_font_family: "Source Sans 3"
    separator_between_connections: ""
    use_icons_for_connections: true
    alignment: "center"
  section_titles:
    type: "moderncv"
    font_family: "Source Sans 3"
    font_size: "1.4em"
    bold: true
    small_caps: false
    line_thickness: "0.5pt"
    vertical_space_above: "0.5cm"
    vertical_space_below: "0.3cm"
  entries:
    date_and_location_width: "4.15cm"
    left_and_right_margin: "0.2cm"
    horizontal_space_between_columns: "0.1cm"
    vertical_space_between_entries: "1.2em"
    allow_page_break_in_sections: true
    allow_page_break_in_entries: true
    short_second_row: false
    show_time_spans_in: []
  highlights:
    bullet: "•"
    top_margin: "0.25cm"
    left_margin: "0.4cm"
    vertical_space_between_highlights: "0.25cm"
    horizontal_space_between_bullet_and_highlight: "0.5em"
    summary_left_margin: "0cm"
  entry_types:
    one_line_entry:
      template: "**LABEL:** DETAILS"
    education_entry:
      main_column_first_row_template: "**INSTITUTION**, AREA"
      degree_column_template: "**DEGREE**"
      degree_column_width: "1cm"
      main_column_second_row_template: |-
        SUMMARY
        HIGHLIGHTS
      date_and_location_column_template: |-
        LOCATION
        DATE
    normal_entry:
      main_column_first_row_template: "**NAME**"
      main_column_second_row_template: |-
        SUMMARY
        HIGHLIGHTS
      date_and_location_column_template: |-
        LOCATION
        DATE
    experience_entry:
      main_column_first_row_template: "**COMPANY**, POSITION"
      main_column_second_row_template: |-
        SUMMARY
        HIGHLIGHTS
      date_and_location_column_template: |-
        LOCATION
        DATE
    publication_entry:
      main_column_first_row_template: "**TITLE**"
      main_column_second_row_template: |-
        AUTHORS
        URL (JOURNAL)
      main_column_second_row_without_journal_template: |-
        AUTHORS
        URL
      main_column_second_row_without_url_template: |-
        AUTHORS
        JOURNAL
      date_and_location_column_template: "DATE"
locale:
  language: "en"
  phone_number_format: "national"
  page_numbering_template: "NAME - Page PAGE_NUMBER of TOTAL_PAGES"
  last_updated_date_template: "Last updated in TODAY"
  date_template: "MONTH_ABBREVIATION YEAR"
  month: "month"
  months: "months"
  year: "year"
  years: "years"
  present: "present"
  to: "–"
  abbreviations_for_months:
    - "Jan"
    - "Feb"
    - "Mar"
    - "Apr"
    - "May"
    - "June"
    - "July"
    - "Aug"
    - "Sept"
    - "Oct"
    - "Nov"
    - "Dec"
  full_names_of_months:
    - "January"
    - "February"
    - "March"
    - "April"
    - "May"
    - "June"
    - "July"
    - "August"
    - "September"
    - "October"
    - "November"
    - "December"
rendercv_settings:
  date: "2025-03-01"
  bold_keywords: []
"""

# Serve the main HTML page
@app.route('/')
def index():
    # Get list of available themes for the dropdown
    themes = theme_manager.get_available_themes()
    # Use the default theme content
    default_yaml = theme_manager.get_default_theme_content()
    # Pass both to the template
    return render_template_string(HTML_TEMPLATE, default_yaml=default_yaml, themes=themes)

# API endpoint to list available themes
@app.route('/themes', methods=['GET'])
def list_themes():
    themes = theme_manager.get_available_themes()
    return jsonify({"themes": themes})

# API endpoint to get a specific theme
@app.route('/themes/<theme_name>', methods=['GET'])
def get_theme(theme_name):
    theme_content = theme_manager.get_theme_content(theme_name)
    if theme_content:
        return jsonify({"theme": theme_name, "content": theme_content})
    else:
        return jsonify({"error": f"Theme '{theme_name}' not found"}), 404

# API endpoint to save a custom theme
@app.route('/themes/save', methods=['POST'])
def save_theme():
    if not request.is_json:
        abort(415, description="Request must be JSON.")
    
    data = request.get_json()
    theme_name = data.get('theme_name')
    yaml_content = data.get('yaml_content')
    
    if not theme_name or not yaml_content:
        return jsonify({"error": "Missing 'theme_name' or 'yaml_content' in request."}), 400
    
    # Validate theme name (no spaces, special chars limited to underscore)
    if not theme_name.replace('_', '').isalnum():
        return jsonify({"error": "Theme name can only contain letters, numbers, and underscores."}), 400
    
    # Try to save the theme
    success = theme_manager.save_theme(theme_name, yaml_content)
    if success:
        return jsonify({"message": f"Theme '{theme_name}' saved successfully."})
    else:
        return jsonify({"error": f"Failed to save theme '{theme_name}'."}), 500

# API endpoint to render YAML to PDF using intermediate Typst file and CLI
@app.route('/render_live', methods=['POST'])
def render_live():
    app.logger.info("Entered /render_live endpoint.")
    if not RENDERCV_AVAILABLE:
         return jsonify({"error": "RenderCV API function not available."}), 500

    if not request.is_json:
        abort(415, description="Request must be JSON.")

    data = request.get_json()
    yaml_content = data.get('yaml_content')

    if not yaml_content:
        return jsonify({"error": "Missing 'yaml_content' in request."}), 400

    # Automatically fix common validation errors
    yaml_content = fix_yaml_validation_errors(yaml_content)

    # Log diagnostic information about icon configuration
    try:
        parsed_yaml = yaml.safe_load(yaml_content)
        # Log header and connection settings
        if 'design' in parsed_yaml and 'header' in parsed_yaml['design']:
            header_config = parsed_yaml['design']['header']
            app.logger.info(f"Header configuration: use_icons_for_connections={header_config.get('use_icons_for_connections', False)}")
        
        # Log which social networks are being used
        if 'cv' in parsed_yaml and 'social_networks' in parsed_yaml['cv']:
            networks = [item.get('network') for item in parsed_yaml['cv']['social_networks']]
            app.logger.info(f"Social networks that need icons: {networks}")
    except Exception as e:
        app.logger.warning(f"Could not parse YAML for icon diagnostics: {e}")

    # Define paths for temporary files
    temp_typ_file = None
    temp_pdf_file = None
    pdf_data_buffer = None
    typst_content = None # Initialize

    try:
        # === Step 1: Generate Typst content from YAML ===
        app.logger.info("Generating Typst content from YAML...")
        typst_content = create_contents_of_a_typst_file_from_a_yaml_string(
            yaml_file_as_string=yaml_content
        )

        # === Step 1.5: Check for Validation Errors (RenderCV returns list on error) ===
        if isinstance(typst_content, list):
            app.logger.warning(f"RenderCV validation failed. Attempting to fix more errors...")
            
            # Apply a more aggressive fix using regex directly on the YAML string
            yaml_content = fix_yaml_with_regex(yaml_content)
            
            # Try validation again with the fixed content
            typst_content = create_contents_of_a_typst_file_from_a_yaml_string(
                yaml_file_as_string=yaml_content
            )
            
            # If still failing, report the errors to the user
            if isinstance(typst_content, list):
                app.logger.warning(f"RenderCV validation still failed after fixes. Errors: {typst_content}")
                # Format errors for frontend
                error_messages = []
                for error in typst_content:
                    field_path = '.'.join(error.get('loc', [])) # Join location tuple into string
                    message = error.get('msg', 'Unknown validation error')
                    error_messages.append(f"Field '{field_path}': {message}")

                return jsonify({
                    "error": "YAML validation failed.",
                    "details": error_messages
                }), 400 # Bad Request

        if not typst_content:
            # This might happen due to other internal RenderCV issues
            app.logger.error("RenderCV generated empty Typst content without validation errors list.")
            return jsonify({"error": "Failed to generate Typst content. RenderCV returned empty result."}), 500

        # If we reach here, typst_content should be a string
        if not isinstance(typst_content, str):
            app.logger.error(f"RenderCV function returned unexpected type after validation check: {type(typst_content)}")
            return jsonify({"error": f"Internal server error: Unexpected content type from RenderCV: {type(typst_content).__name__}"}), 500

        app.logger.info("Typst content generated successfully (string received).")

        # === Step 2: Write Typst content to a temporary file ===
        temp_typ_file = None # Initialize
        temp_typ_path = None # Initialize
        try:
            # We need to keep the file open until typst compilation is done.
            temp_typ_file = tempfile.NamedTemporaryFile(suffix=".typ", delete=False, mode='w', encoding='utf-8')
            temp_typ_path = Path(temp_typ_file.name)

            # No need to check type here anymore, already validated above
            temp_typ_file.write(typst_content)
            temp_typ_file.flush() # Ensure content is written
            app.logger.info(f"Typst content written to temporary file: {temp_typ_path}")

            # === Step 3: Compile Typst file to PDF using CLI ===
            # Create a temporary file path for the PDF output
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
                 temp_pdf_path = Path(f.name)
            app.logger.info(f"Target temporary PDF path: {temp_pdf_path}")

            app.logger.info(f"Compiling {temp_typ_path} to {temp_pdf_path} using typst CLI...")
            
            # Prepare compilation command with advanced font options
            compile_command = ["typst", "compile"]
            
            # Add common options
            compile_command.extend(["--diagnostic-format", "human"])  # For better error messages
            
            # Typst doesn't support --with-system-fonts flag
            # compile_command.extend(["--with-system-fonts"])
            
            # Add input and output paths
            compile_command.extend([str(temp_typ_path), str(temp_pdf_path)])
            
            # Update the compile command to include font path for icons
            # Get the font directory from RenderCV
            try:
                from rendercv.constants import ASSETS_DIR
                font_path = os.path.join(ASSETS_DIR, "fonts")
                if os.path.exists(font_path):
                    # Log what font files are available
                    app.logger.info(f"Available fonts in RenderCV assets directory:")
                    for font_file in os.listdir(font_path):
                        app.logger.info(f"  - {font_file}")
                    
                    compile_command.extend(["--font-path", font_path])
                    app.logger.info(f"Added font path: {font_path}")
                else:
                    app.logger.warning(f"RenderCV font path does not exist: {font_path}")
            except ImportError:
                app.logger.warning("Could not import ASSETS_DIR from rendercv.constants. Icons may not render correctly.")
            
            # Check for custom font path from environment variable
            custom_font_path = os.environ.get('RENDERCV_FONT_PATH')
            if custom_font_path and os.path.exists(custom_font_path):
                # Check if path has a trailing slash and add one if needed
                if not custom_font_path.endswith('/') and not custom_font_path.endswith('\\'):
                    app.logger.info(f"Adding trailing slash to font path")
                    custom_font_path += os.path.sep
                
                # Add the font path to the command
                compile_command.extend(["--font-path", custom_font_path])
                app.logger.info(f"Added custom font path from environment: {custom_font_path}")
                
                # Log available Font Awesome files
                app.logger.info(f"Checking custom font path for Font Awesome files:")
                font_awesome_files = [f for f in os.listdir(custom_font_path) if f.startswith('fa-')]
                if font_awesome_files:
                    app.logger.info(f"Found {len(font_awesome_files)} Font Awesome files:")
                    for fa_file in font_awesome_files:
                        app.logger.info(f"  - {fa_file}")
                    
                    # Modify Typst content to ensure Font Awesome is properly used
                    if 'typst_content' in locals() and isinstance(typst_content, str):
                        # Check if fa-brands is available
                        brands_available = any('brands' in f.lower() for f in font_awesome_files)
                        if brands_available:
                            app.logger.info("Found Font Awesome Brand icons, ensuring they're used in the template")
                            
                            # Import our font mapper
                            try:
                                import font_awesome_map
                                # Inject Font Awesome setup into the Typst content
                                typst_content = font_awesome_map.inject_font_awesome_import(typst_content)
                                app.logger.info("Injected Font Awesome setup into Typst content")
                                
                                # Update the Typst file with the modified content
                                temp_typ_file.close()  # Close to write new content
                                with open(temp_typ_path, 'w', encoding='utf-8') as f:
                                    f.write(typst_content)
                                app.logger.info("Updated Typst file with Font Awesome support")
                            except ImportError:
                                app.logger.warning("Could not import font_awesome_map module")
                            except Exception as e:
                                app.logger.warning(f"Error injecting Font Awesome support: {e}")
                else:
                    app.logger.warning(f"No Font Awesome files found in {custom_font_path}")

            process = subprocess.run(compile_command, capture_output=True, text=True, check=False) # Don't check=True initially

            # Log Typst output (stdout/stderr)
            if process.stdout:
                 app.logger.info(f"Typst stdout:\\n{process.stdout}")
            # Always log stderr, even on success, for potential warnings
            if process.stderr:
                 app.logger.warning(f"Typst stderr (Return Code {process.returncode}):\\n{process.stderr}") # Use warning for stderr

            # Check if compilation was successful
            if process.returncode != 0:
                app.logger.error(f"Typst compilation failed with return code {process.returncode}.")
                error_detail = process.stderr or process.stdout or "Unknown Typst error"
                # Truncate long errors if necessary
                error_detail = (error_detail[:500] + '...') if len(error_detail) > 500 else error_detail
                return jsonify({"error": "Typst compilation failed.", "details": error_detail}), 500

            app.logger.info("Typst compilation seemingly successful (Return Code 0).")

            # === Step 4: Check File, Read PDF to Memory Buffer ===
            # Log file existence and size *before* opening
            if temp_pdf_path.is_file():
                pdf_file_size = temp_pdf_path.stat().st_size
                app.logger.info(f"Generated PDF file exists: {temp_pdf_path}, Size: {pdf_file_size} bytes")
                if pdf_file_size > 0:
                     app.logger.info(f"PDF generated successfully: {temp_pdf_path}")

                     with open(temp_pdf_path, 'rb') as f:
                         pdf_data_buffer = io.BytesIO(f.read())
                     # Log buffer size after reading
                     buffer_size = pdf_data_buffer.getbuffer().nbytes
                     app.logger.info(f"Read PDF content into memory buffer. Buffer size: {buffer_size} bytes.")
                     if buffer_size == 0:
                         app.logger.error("PDF file was read, but the buffer is empty!")
                         # Consider returning an error here? But let send_file handle it for now.

                     pdf_data_buffer.seek(0) # Reset buffer position for sending

                     # Check if we had icon fonts and add a warning if not
                     icon_fonts_found = False
                     try:
                         from rendercv.constants import ASSETS_DIR
                         font_path = os.path.join(ASSETS_DIR, "fonts")
                         if os.path.exists(font_path):
                             for font_file in os.listdir(font_path):
                                 if font_file.lower().find('icon') != -1 or font_file.lower().find('awesome') != -1:
                                     icon_fonts_found = True
                                     break
                     except Exception as e:
                         app.logger.warning(f"Could not check for icon fonts: {e}")
                     
                     # Add warning header if needed
                     if not icon_fonts_found and not os.environ.get('RENDERCV_FONT_PATH'):
                         app.logger.warning("No icon fonts detected - icons may not render correctly in the PDF")
                         response = send_file(
                             pdf_data_buffer,
                             mimetype='application/pdf',
                             as_attachment=False
                         )
                         response.headers['X-Icon-Warning'] = 'true'
                         return response

                     # === Step 5: Send PDF Buffer ===
                     app.logger.info("Attempting to send PDF buffer via send_file...")
                     return send_file(
                         pdf_data_buffer,
                         mimetype='application/pdf',
                         as_attachment=False
                     )
                else:
                    app.logger.error(f"Typst compilation reported success but PDF is empty (0 bytes): {temp_pdf_path}")
                    return jsonify({"error": "PDF generation failed after compilation (file is empty)."}), 500
            else:
                app.logger.error(f"Typst compilation reported success but PDF is missing: {temp_pdf_path}")
                return jsonify({"error": "PDF generation failed after compilation (file missing)."}), 500

        except FileNotFoundError as e:
            # Specific error if 'typst' command is not found
            if 'typst' in str(e):
                 app.logger.error(f"Typst command not found: {e}", exc_info=True)
                 return jsonify({"error": "Rendering failed: Typst command not found or not in PATH."}), 500
            else:
                 app.logger.error(f"File not found error during processing: {e}", exc_info=True)
                 return jsonify({"error": f"Server error: Required file not found."}), 500
        except ImportError:
             # This might occur if the dynamic import fails inside the function somehow
             app.logger.error("RenderCV function could not be imported.", exc_info=True)
             return jsonify({"error": "RenderCV API function not available."}), 500
        except Exception as e:
            app.logger.error(f"Unexpected error during rendering: {e}", exc_info=True)
            tb_str = traceback.format_exc()
            app.logger.error(tb_str)
            return jsonify({"error": f"An unexpected server error occurred: {type(e).__name__}"}), 500
        finally:
            # === Cleanup Temporary Files ===
            # Close the .typ file if it was opened
            if temp_typ_file:
                 try:
                     temp_typ_file.close()
                 except Exception as e:
                     app.logger.error(f"Error closing temporary typ file handle: {e}")

            # Delete the .typ file using its path
            if 'temp_typ_path' in locals() and temp_typ_path and temp_typ_path.exists():
                 try:
                     os.unlink(temp_typ_path)
                     app.logger.info(f"Cleaned up temporary typ file: {temp_typ_path}")
                 except OSError as e:
                     app.logger.error(f"Failed to clean up temporary typ file {temp_typ_path}: {e}")

            # Delete the .pdf file
            if 'temp_pdf_path' in locals() and temp_pdf_path and temp_pdf_path.exists():
                 try:
                     os.unlink(temp_pdf_path)
                     app.logger.info(f"Cleaned up temporary pdf file: {temp_pdf_path}")
                 except OSError as e:
                     app.logger.error(f"Failed to clean up temporary pdf file {temp_pdf_path}: {e}")

    except FileNotFoundError as e:
        # Specific error if 'typst' command is not found
        if 'typst' in str(e):
             app.logger.error(f"Typst command not found: {e}", exc_info=True)
             return jsonify({"error": "Rendering failed: Typst command not found or not in PATH."}), 500
        else:
             app.logger.error(f"File not found error during processing: {e}", exc_info=True)
             return jsonify({"error": f"Server error: Required file not found."}), 500
    except ImportError:
         # This might occur if the dynamic import fails inside the function somehow
         app.logger.error("RenderCV function could not be imported.", exc_info=True)
         return jsonify({"error": "RenderCV API function not available."}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error during rendering: {e}", exc_info=True)
        tb_str = traceback.format_exc()
        app.logger.error(tb_str)
        return jsonify({"error": f"An unexpected server error occurred: {type(e).__name__}"}), 500

# API endpoint to get a specific theme preview
@app.route('/themes/<theme_name>/preview', methods=['GET'])
def preview_theme(theme_name):
    # First, check if the theme exists
    theme_content = theme_manager.get_theme_content(theme_name)
    if not theme_content:
        return jsonify({"error": f"Theme '{theme_name}' not found"}), 404
    
    try:
        # Use a sample resume content but with the requested theme
        sample_cv = yaml.safe_load(DEFAULT_YAML_CONTENT)
        
        # Set the theme
        if 'design' not in sample_cv:
            sample_cv['design'] = {}
        sample_cv['design']['theme'] = theme_name
        
        # Convert back to YAML
        yaml_content = yaml.dump(sample_cv)
        
        # Generate Typst content
        typst_content = create_contents_of_a_typst_file_from_a_yaml_string(
            yaml_file_as_string=yaml_content
        )
        
        # Check for validation errors
        if isinstance(typst_content, list):
            return jsonify({
                "error": "YAML validation failed for preview.",
                "details": [str(err) for err in typst_content]
            }), 400
        
        # Write to temporary Typst file
        with tempfile.NamedTemporaryFile(suffix=".typ", delete=False) as temp_typ_file:
            temp_typ_path = Path(temp_typ_file.name)
            temp_typ_file.write(typst_content.encode('utf-8'))
        
        # Create output PDF file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf_file:
            temp_pdf_path = Path(temp_pdf_file.name)
        
        # Compile using Typst
        compile_command = ["typst", "compile", "--diagnostic-format", "human"]
        
        # Add font path if available
        try:
            from rendercv.constants import ASSETS_DIR
            font_path = os.path.join(ASSETS_DIR, "fonts")
            if os.path.exists(font_path):
                compile_command.extend(["--font-path", font_path])
        except ImportError:
            pass
        
        # Add custom font path from environment if available
        custom_font_path = os.environ.get('RENDERCV_FONT_PATH')
        if custom_font_path and os.path.exists(custom_font_path):
            compile_command.extend(["--font-path", custom_font_path])
        
        # Add input and output paths
        compile_command.extend([str(temp_typ_path), str(temp_pdf_path)])
        
        # Run the command
        subprocess.run(compile_command, check=True)
        
        # Return the PDF file
        return send_file(temp_pdf_path, mimetype='application/pdf', as_attachment=False)
    
    except Exception as e:
        print(f"Error generating preview for theme {theme_name}: {e}")
        return jsonify({"error": f"Failed to generate preview: {str(e)}"}), 500
    finally:
        # Clean up temporary files
        if 'temp_typ_path' in locals() and os.path.exists(temp_typ_path):
            os.unlink(temp_typ_path)
        if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
            os.unlink(temp_pdf_path)

# API endpoint to delete a theme
@app.route('/themes/<theme_name>', methods=['DELETE'])
def delete_theme(theme_name):
    # Check if theme exists
    theme_content = theme_manager.get_theme_content(theme_name)
    if not theme_content:
        return jsonify({"error": f"Theme '{theme_name}' not found"}), 404
    
    # Prevent deletion of built-in themes
    built_in_themes = ['classic', 'moderncv', 'sb2nov', 'engineeringclassic']
    if theme_name in built_in_themes:
        return jsonify({"error": f"Cannot delete built-in theme '{theme_name}'"}), 403
    
    # Try to delete the theme
    try:
        # Get the theme file path
        theme_path = os.path.join(theme_manager.THEMES_DIR, f"{theme_name}.yaml")
        
        # Check if file exists and is not a symlink (security check)
        if os.path.exists(theme_path) and not os.path.islink(theme_path):
            # Delete the file
            os.remove(theme_path)
            return jsonify({"message": f"Theme '{theme_name}' deleted successfully"})
        else:
            return jsonify({"error": f"Theme file not found or is not accessible"}), 404
    except Exception as e:
        print(f"Error deleting theme {theme_name}: {e}")
        return jsonify({"error": f"Failed to delete theme: {str(e)}"}), 500

# --- Template for the Frontend ---
# Modified to include theme selector dropdown
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RenderCV Live Editor</title>
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/theme/material-darker.min.css">
    <!-- Basic Styling -->
    <style>
        /* ... Keep existing styles ... */
        #pdf-preview { width: 100%; height: 100%; border: none; } /* Style for object */
        #download-link-container { padding: 5px; text-align: center; border-top: 1px solid #eee; }
        #pdf-download-link { display: none; /* Show only when URL is ready */ }
        
        /* Status styles */
        #status.success { color: green; }
        #status.error { color: red; }
        #status.loading { color: blue; }
        #status.waiting { color: gray; }
        #status.warning { color: orange; } /* New warning class */
        
        /* Theme selector styles */
        #theme-selector-container {
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
        #theme-selector {
            padding: 5px;
            margin-right: 10px;
        }
        #save-theme-container {
            margin-top: 10px;
        }
        #save-theme-name {
            padding: 5px;
            margin-right: 10px;
        }
        .button {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div id="editor-container">
        <h3>YAML Editor</h3>
        <!-- Theme selector -->
        <div id="theme-selector-container">
            <label for="theme-selector">Select Theme:</label>
            <select id="theme-selector">
                {% for theme in themes %}
                <option value="{{ theme }}">{{ theme }}</option>
                {% endfor %}
            </select>
            <button class="button" id="load-theme-btn">Load Theme</button>
            
            <div id="save-theme-container">
                <input type="text" id="save-theme-name" placeholder="New theme name">
                <button class="button" id="save-theme-btn">Save As New Theme</button>
            </div>
        </div>
        
        <div class="codemirror-wrapper">
            <textarea id="yaml-editor">{{ default_yaml }}</textarea>
        </div>
        <div id="status">Status: Initialized. Edit YAML to update preview.</div>
    </div>

    <div id="preview-container">
        <h3>Live PDF Preview</h3>
        <!-- CHANGED: Use <object> instead of <embed> -->
        <object id="pdf-preview" type="application/pdf" data="about:blank" width="100%" height="95%">
            <!-- Fallback content if object cannot be displayed -->
            <p>PDF preview could not be displayed. Try the download link:</p>
            <div id="download-link-container-fallback" style="padding: 10px;">
                 <a id="pdf-download-link-fallback" href="#" target="_blank" download="cv.pdf">[Download PDF]</a>
            </div>
        </object>
         <!-- Add a separate, always visible container for the download link -->
        <div id="download-link-container">
             <a id="pdf-download-link" href="#" target="_blank" download="cv.pdf">[Download/Open PDF Directly]</a>
        </div>
    </div>

    <!-- CodeMirror JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/yaml/yaml.min.js"></script>
    <!-- Frontend Logic -->
    <script>
        const yamlTextArea = document.getElementById('yaml-editor');
        // Get the object element
        const pdfPreviewObject = document.getElementById('pdf-preview');
        // Get the download links
        const pdfDownloadLink = document.getElementById('pdf-download-link');
        const pdfDownloadLinkFallback = document.getElementById('pdf-download-link-fallback'); // For fallback link
        
        // Theme selector elements
        const themeSelector = document.getElementById('theme-selector');
        const loadThemeBtn = document.getElementById('load-theme-btn');
        const saveThemeNameInput = document.getElementById('save-theme-name');
        const saveThemeBtn = document.getElementById('save-theme-btn');

        const statusDiv = document.getElementById('status');
        let debounceTimeout;
        let currentBlobUrl = null;

        const editor = CodeMirror.fromTextArea(yamlTextArea, { /* ... options ... */ });
        function debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

        // Theme loading functionality
        loadThemeBtn.addEventListener('click', async () => {
            const selectedTheme = themeSelector.value;
            statusDiv.textContent = `Status: Loading ${selectedTheme} theme...`;
            statusDiv.className = 'loading';
            
            try {
                const response = await fetch(`/themes/${selectedTheme}`);
                if (response.ok) {
                    const data = await response.json();
                    editor.setValue(data.content);
                    statusDiv.textContent = `Status: ${selectedTheme} theme loaded successfully!`;
                    statusDiv.className = 'success';
                    // Trigger preview update
                    setTimeout(updatePreview, 500);
                } else {
                    const errorData = await response.json();
                    statusDiv.textContent = `Error loading theme: ${errorData.error || 'Unknown error'}`;
                    statusDiv.className = 'error';
                }
            } catch (error) {
                statusDiv.textContent = `Error loading theme: ${error.message}`;
                statusDiv.className = 'error';
            }
        });
        
        // Theme saving functionality
        saveThemeBtn.addEventListener('click', async () => {
            const themeName = saveThemeNameInput.value.trim();
            if (!themeName) {
                statusDiv.textContent = 'Error: Please enter a theme name';
                statusDiv.className = 'error';
                return;
            }
            
            // Validate theme name - letters, numbers, underscores only
            if (!/^[a-zA-Z0-9_]+$/.test(themeName)) {
                statusDiv.textContent = 'Error: Theme name can only contain letters, numbers, and underscores';
                statusDiv.className = 'error';
                return;
            }
            
            statusDiv.textContent = `Status: Saving theme "${themeName}"...`;
            statusDiv.className = 'loading';
            
            try {
                const response = await fetch('/themes/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        theme_name: themeName,
                        yaml_content: editor.getValue()
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    statusDiv.textContent = `Status: ${data.message}`;
                    statusDiv.className = 'success';
                    
                    // Check if the theme is already in the dropdown list
                    let themeExists = false;
                    for (let i = 0; i < themeSelector.options.length; i++) {
                        if (themeSelector.options[i].value === themeName) {
                            themeExists = true;
                            break;
                        }
                    }
                    
                    // Add the theme to the dropdown if it doesn't exist
                    if (!themeExists) {
                        const option = document.createElement('option');
                        option.value = themeName;
                        option.textContent = themeName;
                        themeSelector.appendChild(option);
                    }
                    
                    // Select the newly saved theme
                    themeSelector.value = themeName;
                } else {
                    statusDiv.textContent = `Error: ${data.error || 'Failed to save theme'}`;
                    statusDiv.className = 'error';
                }
            } catch (error) {
                statusDiv.textContent = `Error saving theme: ${error.message}`;
                statusDiv.className = 'error';
            }
        });

        async function updatePreview() {
            console.log("updatePreview function started.");
            const yamlContent = editor.getValue();
            statusDiv.textContent = 'Status: Change detected, requesting render...';
            statusDiv.className = 'loading';
            // Hide download link while loading
            pdfDownloadLink.style.display = 'none';
            pdfDownloadLinkFallback.style.display = 'none';


            if (currentBlobUrl) {
                console.log("Revoking previous Blob URL:", currentBlobUrl);
                URL.revokeObjectURL(currentBlobUrl);
                currentBlobUrl = null; // Reset the variable
            }
            // Set object data to blank while loading
             pdfPreviewObject.data = 'about:blank';


            try {
                console.log("Attempting to fetch /render_live...");
                const response = await fetch('/render_live', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        yaml_content: yamlContent
                    })
                });
                console.log("Response Status:", response.status, response.ok);

                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    console.log("Response Content-Type:", contentType);

                    // Check for icon warning header
                    const iconWarning = response.headers.get("X-Icon-Warning");
                    
                    if (contentType && contentType.includes("application/pdf")) {
                        const pdfBlob = await response.blob();
                        if (!pdfBlob || pdfBlob.size === 0) {
                            console.error('Received empty blob for PDF.');
                            displayErrors({ error: "Received empty PDF data from server.", details: ["Check server logs for Typst errors."] });
                            return;
                        }

                        currentBlobUrl = URL.createObjectURL(pdfBlob);
                        console.log("Created Blob URL:", currentBlobUrl);

                        // Update the main download link
                        pdfDownloadLink.href = currentBlobUrl;
                        pdfDownloadLink.style.display = 'inline'; // Show the link

                        // Update the fallback download link
                        pdfDownloadLinkFallback.href = currentBlobUrl;
                         pdfDownloadLinkFallback.style.display = 'inline';


                        console.log("Setting object data attribute...");
                        // Set the data attribute of the object element
                        pdfPreviewObject.data = currentBlobUrl;
                        console.log("object data set.");

                        let statusMessage = 'Status: Preview updated successfully!';
                        
                        // If we have an icon warning, display it
                        if (iconWarning === 'true') {
                            statusMessage += ' Note: Icons may not display correctly. Run setup_fonts.py or install Font Awesome.';
                            statusDiv.className = 'warning';
                        } else {
                            statusDiv.className = 'success';
                        }
                        
                        statusDiv.textContent = statusMessage;
                    } else if (contentType && contentType.includes("application/json")) {
                         // Handle JSON response (likely validation errors)
                        console.log("Received JSON response (likely errors).");
                        const errorData = await response.json();
                        displayErrors(errorData, response.status); // Pass status code too
                    } else {
                         // Handle unexpected content type
                        console.error("Unexpected content type received:", contentType);
                        const responseText = await response.text(); // Get text for debugging
                        displayErrors({ error: "Received unexpected content type from server.", details: [`Content-Type: ${contentType}`, `Response Text (first 500 chars): ${responseText.substring(0, 500)}`] }, response.status);
                    }
                } else {
                    // Handle non-OK HTTP responses (4xx, 5xx)
                    console.error("Non-OK response status:", response.status);
                    let errorData;
                    try {
                        // Try to parse as JSON first, as our error responses should be JSON
                        errorData = await response.json();
                    } catch (e) {
                        // If not JSON, get text
                        const errorText = await response.text();
                        errorData = { error: `Server returned status ${response.status}`, details: [`Response Text (first 500 chars): ${errorText.substring(0, 500)}`] };
                    }
                    displayErrors(errorData, response.status);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                displayErrors({ error: "Network or client-side error occurred.", details: [`Error: ${error.message}`] });
            }
        }

        function displayErrors(errorData, statusCode = null) {
            console.log("displayErrors called with:", errorData, "Status Code:", statusCode);
            let errorMessage = `Error: ${errorData.error || 'Unknown error'}`;
            if (statusCode) {
                errorMessage += ` (Status: ${statusCode})`;
            }
            if (errorData.details && Array.isArray(errorData.details)) {
                errorMessage += ": <br> - " + errorData.details.join("<br> - ");
            }
            statusDiv.innerHTML = errorMessage; // Use innerHTML to render <br>
            statusDiv.className = 'error';

             // Ensure object data is cleared on error
             pdfPreviewObject.data = 'about:blank';
             // Hide download links on error
             pdfDownloadLink.style.display = 'none';
             pdfDownloadLinkFallback.style.display = 'none';

             if (currentBlobUrl) {
                 console.log("Revoking Blob URL due to error:", currentBlobUrl);
                 URL.revokeObjectURL(currentBlobUrl);
                 currentBlobUrl = null;
             }
        }

        const debouncedUpdate = debounce(updatePreview, 1500);
        editor.on('change', () => {
            console.log("CodeMirror 'change' event fired.");
            statusDiv.textContent = 'Status: Change detected, waiting for pause...';
            statusDiv.className = 'waiting';
            debouncedUpdate();
        });
        // setTimeout(updatePreview, 500); // <-- Comment out this line

    </script>
</body>
</html>
"""

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
import axios from 'axios';
import yaml from 'js-yaml';

// API endpoint configuration using NextJS API routes as proxy
const THEMES_ENDPOINT = `/api/themes`;

// Local theme definitions for fallback (for when API is not available)
const LOCAL_THEMES = ['classic', 'moderncv']; 

// Theme content cache
const themeContentCache: Record<string, any> = {
  classic: {
    cv: {
      name: "John Doe",
      location: "Location",
      email: "john.doe@example.com",
      phone: "+1-609-999-9995",
      website: "",
      social_networks: [
        { network: "LinkedIn", username: "john.doe" },
        { network: "GitHub", username: "john.doe" }
      ],
      sections: {
        welcome_to_RenderCV: [
          "[RenderCV](https://rendercv.com) is a Typst-based CV framework designed for academics and engineers, with Markdown syntax support.",
          "Each section title is arbitrary. Each section contains a list of entries, and there are 7 different entry types to choose from."
        ],
        education: [
          {
            institution: "Stanford University",
            area: "Computer Science",
            degree: "PhD",
            start_date: "2023-09",
            end_date: "present",
            location: "Stanford, CA, USA",
            highlights: ["Working on the optimization of autonomous vehicles in urban environments"]
          },
          {
            institution: "Boğaziçi University",
            area: "Computer Engineering",
            degree: "BS",
            start_date: "2018-09",
            end_date: "2022-06",
            location: "Istanbul, Türkiye",
            highlights: [
              "GPA: 3.9/4.0, ranked 1st out of 100 students",
              "Awards: Best Senior Project, High Honor"
            ]
          }
        ]
      }
    },
    design: {
      theme: "classic",
    },
    locale: {
      language: "en"
    }
  },
  moderncv: {
    cv: {
      name: "John Doe",
      location: "Location",
      email: "john.doe@example.com",
      phone: "+1-609-999-9995",
      website: "",
      social_networks: [
        { network: "LinkedIn", username: "john.doe" },
        { network: "GitHub", username: "john.doe" }
      ],
      sections: {
        welcome_to_RenderCV: [
          "[RenderCV](https://rendercv.com) is a Typst-based framework designed for academics and engineers, with Markdown syntax support.",
          "Each section title is arbitrary. Each section contains a list of entries, and there are 7 different entry types to choose from."
        ],
        education: [
          {
            institution: "Stanford University",
            area: "Computer Science",
            degree: "PhD",
            start_date: "2023-09",
            end_date: "present",
            location: "Stanford, CA, USA",
            highlights: ["Working on the optimization of autonomous vehicles in urban environments"]
          },
          {
            institution: "Boğaziçi University",
            area: "Computer Engineering",
            degree: "BS", 
            start_date: "2018-09",
            end_date: "2022-06",
            location: "Istanbul, Türkiye",
            highlights: [
              "GPA: 3.9/4.0, ranked 1st out of 100 students",
              "Awards: Best Senior Project, High Honor"
            ]
          }
        ]
      }
    },
    design: {
      theme: "moderncv",
      text: {
        font_family: "Fontin",
        font_size: "10pt"
      },
      header: {
        name_font_family: "Fontin",
        name_font_size: "25pt",
        name_bold: false,
        alignment: "left"
      },
      section_titles: {
        type: "moderncv",
        font_family: "Fontin",
        font_size: "1.4em",
        bold: false,
        line_thickness: "0.15cm"
      }
    },
    locale: {
      language: "en"
    }
  }
};

export class ThemeService {
  /**
   * Get all available themes from the API with fallback
   * @returns Array of theme names
   */
  static async getThemes(): Promise<string[]> {
    return LOCAL_THEMES; // Return local themes directly, no API call
  }

  /**
   * Get a specific theme's data by name using hardcoded data
   * @param themeName The name of the theme to fetch
   * @returns Parsed YAML data or null if theme does not exist
   */
  static async getTheme(themeName: string): Promise<any> {
    // Use hardcoded data directly since file system operations are not supported in browser
    return themeContentCache[themeName] || null;
  }

  /**
   * Preview a theme with sample data
   * @param themeName The name of the theme to preview
   * @returns URL to the preview PDF or null if preview failed
   */
  static async previewTheme(themeName: string): Promise<string | null> {
    try {
      const response = await axios.get(`${THEMES_ENDPOINT}/${themeName}/preview`, {
        responseType: 'blob'
      });
      
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error previewing theme ${themeName}:`, error);
      return null;
    }
  }

  /**
   * Saves a theme (creates new or updates existing)
   * @param themeName Name of the theme
   * @param yamlContent YAML content for the theme
   * @returns Success status and message
   */
  static async saveTheme(themeName: string, yamlContent: string): Promise<{success: boolean; message: string}> {
    try {
      const response = await axios.post(`${THEMES_ENDPOINT}/save`, {
        theme_name: themeName,
        yaml_content: yamlContent
      });
      
      return {
        success: true,
        message: response.data.message || 'Theme saved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to save theme'
      };
    }
  }

  /**
   * Deletes a theme
   * @param themeName Name of the theme to delete
   * @returns Success status and message
   */
  static async deleteTheme(themeName: string): Promise<{success: boolean; message: string}> {
    try {
      const response = await axios.delete(`${THEMES_ENDPOINT}/delete/${themeName}`);
      
      return {
        success: true,
        message: response.data.message || 'Theme deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to delete theme'
      };
    }
  }
} 
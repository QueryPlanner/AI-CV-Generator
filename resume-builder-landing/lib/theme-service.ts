import axios from 'axios';

// API endpoint configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const THEMES_ENDPOINT = `${API_BASE_URL}/themes`;

export class ThemeService {
  /**
   * Get all available themes from the API
   * @returns Array of theme names
   */
  static async getThemes(): Promise<string[]> {
    try {
      const response = await axios.get(THEMES_ENDPOINT);
      return response.data.themes || [];
    } catch (error) {
      console.error('Error fetching themes:', error);
      return ['classic', 'modern']; // Fallback themes if API fails
    }
  }

  /**
   * Get a specific theme's data by name
   * @param themeName The name of the theme to fetch
   * @returns Theme data as JSON or null if theme does not exist
   */
  static async getTheme(themeName: string): Promise<any> {
    try {
      const response = await axios.get(`${THEMES_ENDPOINT}/${themeName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching theme ${themeName}:`, error);
      return null;
    }
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
   * Deletes a theme (not yet implemented in API)
   * @param themeName Name of the theme to delete
   * @returns Success status and message
   */
  static async deleteTheme(themeName: string): Promise<{success: boolean; message: string}> {
    try {
      const response = await axios.delete(`${THEMES_ENDPOINT}/${themeName}`);
      
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
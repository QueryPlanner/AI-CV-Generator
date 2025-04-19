import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ThemeService } from '@/lib/theme-service';
import { toast } from 'sonner';

interface ThemeSelectorProps {
  onThemeSelect: (yamlContent: string) => void;
  currentYaml: string;
}

export function ThemeSelector({ onThemeSelect, currentYaml }: ThemeSelectorProps) {
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const themes = await ThemeService.getThemes();
      setThemes(themes);
      
      // Set the first theme as default if available
      if (themes.length > 0 && !selectedTheme) {
        setSelectedTheme(themes[0]);
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
      toast.error('Failed to load themes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSelect = async (value: string) => {
    setSelectedTheme(value);
    setIsLoading(true);
    
    try {
      const theme = await ThemeService.getTheme(value);
      if (theme && theme.content) {
        onThemeSelect(theme.content);
        toast.success(`Loaded theme: ${value}`);
      } else {
        toast.error(`Failed to load theme: ${value}`);
      }
    } catch (error) {
      console.error('Failed to load theme content:', error);
      toast.error('Failed to load theme content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    if (!newThemeName) {
      toast.error('Please enter a theme name');
      return;
    }

    // Validate theme name - letters, numbers, underscores only
    if (!/^[a-zA-Z0-9_]+$/.test(newThemeName)) {
      toast.error('Theme name can only contain letters, numbers, and underscores');
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await ThemeService.saveTheme(newThemeName, currentYaml);
      if (success) {
        toast.success(`Theme "${newThemeName}" saved successfully`);
        setNewThemeName('');
        // Refresh the theme list
        await loadThemes();
        // Select the newly created theme
        setSelectedTheme(newThemeName);
      } else {
        toast.error(`Failed to save theme "${newThemeName}"`);
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Theme Templates</h3>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedTheme} 
            onValueChange={handleThemeSelect} 
            disabled={isLoading || themes.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={loadThemes} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Save Current Template</h3>
        <div className="flex items-center gap-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input 
              id="theme-name" 
              value={newThemeName} 
              onChange={(e) => setNewThemeName(e.target.value)} 
              placeholder="my_custom_theme"
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleSaveTheme} 
            disabled={isSaving || !newThemeName || !currentYaml} 
            className="mt-5"
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { ThemeService } from '@/lib/theme-service';
import yaml from 'js-yaml';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Save, Trash, Eye, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeManagementProps {
  yamlContent: string;
  onThemeSelect: (themeName: string) => Promise<void>;
}

export function ThemeManagement({ yamlContent, onThemeSelect }: ThemeManagementProps) {
  const [themes, setThemes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
  
  // Load themes when component mounts
  useEffect(() => {
    loadThemes();
  }, []);
  
  // Load themes from API
  const loadThemes = async () => {
    try {
      setIsLoadingThemes(true);
      const themeList = await ThemeService.getThemes();
      setThemes(themeList);
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setIsLoadingThemes(false);
    }
  };
  
  // Save current YAML as a new theme
  const saveAsTheme = async () => {
    if (!newThemeName.trim()) {
      setSaveError('Theme name cannot be empty');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(newThemeName)) {
      setSaveError('Theme name can only contain letters, numbers, and underscores');
      return;
    }
    
    setIsLoading(true);
    setSaveError(null);
    
    try {
      // Parse the YAML to make sure the design.theme property is set correctly
      const parsedYaml = yaml.load(yamlContent) as any;
      
      if (!parsedYaml.design) {
        parsedYaml.design = {};
      }
      
      parsedYaml.design.theme = newThemeName;
      
      // Convert back to YAML
      const updatedYaml = yaml.dump(parsedYaml);
      
      // Save the theme
      const result = await ThemeService.saveTheme(newThemeName, updatedYaml);
      
      if (result.success) {
        // Close the dialog and refresh themes
        setSaveDialogOpen(false);
        setNewThemeName('');
        await loadThemes();
        
        // Select the new theme
        await onThemeSelect(newThemeName);
      } else {
        setSaveError(result.message);
      }
    } catch (error: any) {
      setSaveError(`Error saving theme: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a theme
  const deleteTheme = async () => {
    if (!themeToDelete) return;
    
    try {
      const result = await ThemeService.deleteTheme(themeToDelete);
      
      if (result.success) {
        // Refresh themes list
        await loadThemes();
      } else {
        console.error(`Failed to delete theme: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
    } finally {
      setThemeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  // Preview a theme
  const previewTheme = async (themeName: string) => {
    setPreviewLoading(true);
    setPreviewUrl(null);
    
    try {
      const url = await ThemeService.previewTheme(themeName);
      setPreviewUrl(url);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error(`Error previewing theme ${themeName}:`, error);
    } finally {
      setPreviewLoading(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoadingThemes}>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700 h-7 px-3 flex items-center"
          >
            {isLoadingThemes ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <>
                {selectedTheme || 'Select Theme'}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-800 border-slate-700 text-slate-300">
          {themes.map((theme) => (
            <DropdownMenuItem 
              key={theme}
              className="flex items-center justify-between cursor-pointer hover:bg-slate-700 hover:text-white"
              onClick={() => {
                setSelectedTheme(theme);
                onThemeSelect(theme);
              }}
            >
              <span className={cn(
                "mr-2",
                selectedTheme === theme && "font-semibold text-green-500"
              )}>
                {theme}
              </span>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-slate-700 text-slate-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    previewTheme(theme);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog open={deleteDialogOpen && themeToDelete === theme} onOpenChange={(open) => !open && setThemeToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-slate-700 text-slate-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThemeToDelete(theme);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Theme</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Are you sure you want to delete the theme "{theme}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={deleteTheme}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700 h-7 px-3"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save as Theme
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Save as New Theme</DialogTitle>
            <DialogDescription className="text-slate-400">
              Save your current resume design as a reusable theme.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  placeholder="my_custom_theme"
                  value={newThemeName}
                  onChange={(e) => {
                    setNewThemeName(e.target.value);
                    setSaveError(null);
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {saveError && (
                  <p className="text-red-500 text-sm">{saveError}</p>
                )}
                <p className="text-xs text-slate-400">
                  Theme name can only contain letters, numbers, and underscores.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSaveDialogOpen(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveAsTheme}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Theme Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Theme Preview</DialogTitle>
            <DialogDescription className="text-slate-400">
              This is a preview of how the theme will look.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 h-[60vh] flex items-center justify-center bg-slate-900 rounded-md">
            {previewLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                <p className="text-slate-400">Loading preview...</p>
              </div>
            ) : previewUrl ? (
              <object 
                data={previewUrl} 
                type="application/pdf" 
                width="100%" 
                height="100%"
                className="rounded-md"
              >
                <p className="text-center py-4">
                  Unable to display PDF preview. <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Open in new tab</a>
                </p>
              </object>
            ) : (
              <div className="text-center py-4 text-red-500">
                Failed to load preview.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setPreviewDialogOpen(false);
                // Clean up object URL
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
            >
              Close
            </Button>
            {selectedTheme && (
              <Button 
                onClick={() => {
                  onThemeSelect(selectedTheme);
                  setPreviewDialogOpen(false);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Theme
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
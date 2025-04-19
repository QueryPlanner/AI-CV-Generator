"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Sparkles, ChevronLeft, ChevronRight, Menu, Home, Eye, Code, Save, Settings, ArrowLeft, RefreshCw } from "lucide-react";
import Editor from "@monaco-editor/react";
import * as yaml from "js-yaml";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeService } from "@/lib/theme-service";
import { ThemeManagement } from '@/components/theme-management';

interface RenderCVProps {
  initialYaml?: string;
  onUpdate?: (yamlContent: string) => void;
}

export default function RenderCV({ initialYaml, onUpdate }: RenderCVProps) {
  const [yamlContent, setYamlContent] = useState<string>(
    initialYaml ||
      `# RenderCV YAML Format
name: John Doe
title: Software Engineer
contact:
  email: john.doe@example.com
  phone: (123) 456-7890
  location: San Francisco, CA
design:
  theme: classic

education:
  - institution: University of California, Berkeley
    degree: Bachelor of Science in Computer Science
    date: 2018 - 2022
    gpa: 3.9/4.0

experience:
  - company: Tech Innovations Inc.
    title: Software Engineer
    date: June 2022 - Present
    description: |
      - Developed and maintained web applications using React and Node.js
      - Improved system performance by 35% through database optimization
      - Collaborated with cross-functional teams to deliver features

skills:
  - category: Programming Languages
    items: [JavaScript, TypeScript, Python, Java]
  - category: Frameworks & Libraries
    items: [React, Node.js, Express, Django]
  - category: Tools & Platforms
    items: [Git, Docker, AWS, CI/CD]`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState<boolean>(false);
  
  // Gemini optimization states
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [showGeminiOutput, setShowGeminiOutput] = useState<boolean>(false);
  const [beforeContent, setBeforeContent] = useState<string>("");
  
  // UI state
  const [editorMode, setEditorMode] = useState<"code" | "visual">("code");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Parse the YAML content to validate it
  const validateYaml = (content: string): boolean => {
    try {
      yaml.load(content);
      setError(null);
      return true;
    } catch (e: any) {
      setError(`YAML Parsing Error: ${e.message}`);
      return false;
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const content = value || "";
    setYamlContent(content);
    
    // Notify parent component if needed
    if (onUpdate) {
      onUpdate(content);
    }
    
    // Clear any existing timeout to prevent multiple renders
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    // Debounce the render request
    renderTimeoutRef.current = setTimeout(() => {
      if (validateYaml(content)) {
        renderCV(content);
      }
    }, 1500);
  };

  const renderCV = async (content: string) => {
    // Revoke previous PDF URL to prevent memory leaks
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/render-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yamlContent: content,
        }),
      });
      
      // Check for error responses
      if (!response.ok) {
        let errorData;
        
        try {
          errorData = await response.json();
          const errorMessage = errorData.error || `Server error: ${response.status}`;
          const errorDetails = errorData.details ? errorData.details.join('\n') : '';
          setError(`${errorMessage}\n${errorDetails}`);
        } catch (e) {
          // If not JSON, get the text
          const errorText = await response.text();
          setError(`Server error (${response.status}): ${errorText.substring(0, 500)}`);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Handle successful response
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/pdf')) {
        const pdfBlob = await response.blob();
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(newPdfUrl);
      } else {
        setError('Unexpected response format from server');
      }
    } catch (error) {
      setError(`Failed to render CV: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to optimize resume using Gemini API
  const optimizeResume = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }
    
    try {
      setIsOptimizing(true);
      setError(null);
      setBeforeContent(yamlContent); // Store original content for comparison
      
      // Get API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        setError("Gemini API key not configured. Please contact the administrator.");
        setIsOptimizing(false);
        return;
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
      I have a resume in YAML format and a job description. Please optimize my resume to better match the job description.
      
      FOCUS on these areas:
      1. Professional Summary: Create a compelling and targeted summary that directly addresses the job requirements
      2. Projects: Highlight projects that demonstrate skills mentioned in the job description
      3. Skills: Reorganize skills to prominently feature those that match the job description
      4. Experience & Education: Reword job duties and accomplishments to better align with the job description
      
      Make the following changes to increase the resume's match for this specific job:
      - Use keywords and phrases from the job description in the professional summary
      - Emphasize projects that showcase relevant skills
      - Rewrite experience bullet points to highlight achievements that align with the job requirements
      - Adjust skill priorities to match what the employer is seeking
      - Use industry terminology from the job description
      
      IMPORTANT:
      - DO NOT add fictional experiences, skills, or projects - only optimize what's already there
      - Maintain the exact same YAML structure and formatting
      - Return ONLY the complete YAML with no additional text
      - Ensure the result satisfies all major requirements in the job description
      
      CURRENT RESUME:
      ${yamlContent}
      
      JOB DESCRIPTION:
      ${jobDescription}
      `;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      setGeminiResponse(text);
      setShowGeminiOutput(true);
      
      // Extract YAML content from response (in case there's additional text)
      let optimizedYaml = text;
      if (text.includes('```yaml')) {
        optimizedYaml = text.split('```yaml')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        optimizedYaml = text.split('```')[1].split('```')[0].trim();
      }
      
      // Validate YAML before setting
      try {
        const parsedYaml = yaml.load(optimizedYaml);
        setYamlContent(optimizedYaml);
        validateYaml(optimizedYaml);
        renderCV(optimizedYaml);
      } catch (e: any) {
        setError(`Invalid YAML returned: ${e.message}`);
      }
      
    } catch (error: any) {
      setError(`Error optimizing resume: ${error.message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Load themes from API
  const loadThemes = async () => {
    try {
      setIsLoadingThemes(true);
      const themes = await ThemeService.getThemes();
      setAvailableThemes(themes);
      setIsLoadingThemes(false);
    } catch (error) {
      console.error("Failed to load themes:", error);
      setIsLoadingThemes(false);
    }
  };

  // Load themes on component mount
  useEffect(() => {
    loadThemes();
  }, []);

  // Function to update the template theme in the YAML
  const updateTemplate = async (template: string) => {
    try {
      setSelectedTemplate(template);
      
      // Get the theme YAML from the API
      const themeContent = await ThemeService.getTheme(template);
      
      // Parse current YAML
      const cvData = yaml.load(yamlContent) as any;
      
      // Update the design theme
      if (!cvData.design) {
        cvData.design = {};
      }
      cvData.design.theme = template;
      
      // Convert back to YAML
      const updatedYaml = yaml.dump(cvData);
      
      // Update content and render
      setYamlContent(updatedYaml);
      renderCV(updatedYaml);
      
    } catch (e: any) {
      setError(`Error updating template: ${e.message}`);
    }
  };

  // Initial render
  useEffect(() => {
    if (validateYaml(yamlContent)) {
      try {
        const cvData = yaml.load(yamlContent) as any;
        if (cvData.design?.theme) {
          setSelectedTemplate(cvData.design.theme);
        }
      } catch (e) {
        // Ignore parsing errors here
      }
      renderCV(yamlContent);
    }
  }, []);

  // Update effect when yamlContent changes from external sources
  useEffect(() => {
    try {
      if (yamlContent) {
        const cvData = yaml.load(yamlContent) as any;
        if (cvData.design?.theme && cvData.design.theme !== selectedTemplate) {
          setSelectedTemplate(cvData.design.theme);
        }
      }
    } catch (e) {
      // Ignore parsing errors here
    }
  }, [yamlContent]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950">
      {/* Main Content Area - REMOVED DUPLICATE HEADER */}
      <div className="flex w-full overflow-hidden">
        {/* Toolbar */}
        <div className="w-full bg-slate-900 border-y border-slate-700 flex items-center justify-between px-4 py-1">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 h-7 px-2">
                <Home className="h-3.5 w-3.5 mr-1" />
                Back to Home
              </Button>
            </Link>
            <h2 className="text-lg font-semibold text-white mr-4">RenderCV PDF Generator with AI Optimization</h2>
            
            <div className="flex items-center bg-slate-800 rounded overflow-hidden">
              <Button 
                size="sm"
                variant={editorMode === "code" ? "default" : "ghost"}
                className={`h-7 px-3 rounded-none ${editorMode === "code" ? "bg-green-600 hover:bg-green-700" : "text-slate-300 hover:text-white"}`}
                onClick={() => setEditorMode("code")}
              >
                <Code className="h-3.5 w-3.5 mr-1" />
                Code Editor
              </Button>
              <Button 
                size="sm"
                variant={editorMode === "visual" ? "default" : "ghost"}
                className={`h-7 px-3 rounded-none ${editorMode === "visual" ? "bg-blue-600 hover:bg-blue-700" : "text-slate-300 hover:text-white"}`}
                onClick={() => setEditorMode("visual")}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Visual Editor
              </Button>
            </div>
            
            <ThemeManagement 
              yamlContent={yamlContent}
              onThemeSelect={updateTemplate}
            />
            
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700 h-7 px-3"
              onClick={() => renderCV(yamlContent)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Recompile
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700 h-7 px-3"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main workspace - FULL WIDTH */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* YAML Editor - EXACTLY 50% */}
        <div className="w-1/2 h-full flex flex-col">
          <div className="flex justify-between items-center px-2 py-1 bg-slate-800 border-b border-slate-700">
            <h3 className="text-sm font-medium text-white">Resume YAML</h3>
            <div className="flex gap-1">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700 h-7 px-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Optimize with AI
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] bg-slate-800 text-white border-t border-slate-700">
                  <div className="p-4 h-full">
                    <h3 className="text-lg font-semibold mb-2">AI Resume Optimization</h3>
                    <div className="flex flex-col h-[calc(100%-6rem)]">
                      <Label htmlFor="job-description" className="text-slate-300 mb-2">
                        Paste job description to optimize your resume
                      </Label>
                      <Textarea
                        id="job-description"
                        placeholder="Paste the job description here..."
                        className="bg-slate-700 border-slate-600 text-white flex-1 mb-4"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            optimizeResume();
                            setDrawerOpen(false);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 flex-1"
                          disabled={isOptimizing}
                        >
                          {isOptimizing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Optimizing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Optimize Resume
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-600"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                      
                      {/* Gemini Response Dialog Trigger */}
                      {geminiResponse && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="mt-4 w-full border-indigo-500 text-indigo-300 hover:bg-indigo-900/20"
                            >
                              Show AI Analysis
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle>Gemini AI Resume Analysis</DialogTitle>
                              <DialogDescription>
                                This is the analysis and optimization provided by Gemini AI
                              </DialogDescription>
                            </DialogHeader>
                            <pre className="bg-slate-100 p-3 rounded text-xs whitespace-pre-wrap border border-slate-200 overflow-auto">
                              {geminiResponse}
                            </pre>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              
              {error && (
                <div className="text-red-500 text-xs overflow-auto max-h-20">
                  {error.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-900">
            <Editor
              defaultLanguage="yaml"
              value={yamlContent}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                fontSize: 13,
                padding: { top: 4, bottom: 4 },
              }}
              className="h-full w-full"
            />
          </div>
        </div>
        
        {/* PDF Preview - EXACTLY 50% */}
        <div className="w-1/2 h-full flex flex-col border-l border-slate-700">
          <div className="flex justify-between items-center px-2 py-1 bg-slate-800 border-b border-slate-700">
            <h3 className="text-sm font-medium text-white">PDF Preview</h3>
            <div className="flex gap-1">
              {isLoading ? (
                <Button disabled size="sm" variant="outline" className="text-slate-500 h-7 px-2 py-0">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Rendering...
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => renderCV(yamlContent)} 
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 py-0"
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Render
                  </Button>
                  {pdfUrl && (
                    <Button 
                      onClick={handleDownloadPDF} 
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 py-0"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-700">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                <span className="ml-2 text-slate-300">Rendering PDF...</span>
              </div>
            ) : pdfUrl ? (
              <iframe
                ref={pdfPreviewRef}
                src={pdfUrl}
                className="w-full h-full bg-white"
                title="Resume PDF Preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">
                <FileText className="h-8 w-8 text-slate-400 mr-2" />
                Edit YAML and click Render to preview your resume
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as yaml from "js-yaml";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Placeholder for the initial YAML content
const initialYamlContent = `
# Welcome to the Resume Builder!
# Edit this YAML content to see the preview update.

cv:
  name: John Doe
  location: San Francisco, CA
  email: john.doe@example.com
  phone: +1-415-555-7890
  website: https://johndoe.dev
  social_networks:
    - network: LinkedIn
      username: john.doe
    - network: GitHub
      username: john.doe
  sections:
    professional_summary:
      - 'Experienced software engineer with over 8 years of expertise in full-stack development, cloud architecture, and machine learning.'
    education:
      - institution: Stanford University
        area: Computer Science
        degree: PhD
        date:
        start_date: 2023-09
        end_date: present
        location: Stanford, CA, USA
        summary:
        highlights:
          - Working on the optimization of autonomous vehicles in urban environments
      - institution: Tech University
        area: Computer Engineering
        degree: BS
        date:
        start_date: 2018-09
        end_date: 2022-06
        location: San Francisco, CA
        summary:
        highlights:
          - 'GPA: 3.9/4.0, ranked 1st out of 100 students'
          - 'Awards: Best Senior Project, High Honor'
    experience:
      - company: Tech Corp
        position: Senior Software Engineer
        date:
        start_date: 2022-06
        end_date: present
        location: San Francisco, CA
        summary:
        highlights:
          - Led development of microservices architecture using Go and Kubernetes
          - Improved system performance by 40% through database query optimization
      - company: Startup Inc
        position: Software Engineer
        date:
        start_date: 2020-01
        end_date: 2022-05
        location: San Francisco, CA
        summary:
        highlights:
          - Developed RESTful APIs using Node.js and Express
          - Contributed to frontend development using React and TypeScript
    skills:
      - label: Programming
        details: 'Proficient with Go, Python, JavaScript, TypeScript, React, Node.js'
      - label: DevOps
        details: 'Kubernetes, Docker, CI/CD, AWS, GCP'
      - label: Languages
        details: 'English (native), Spanish (conversational)'
design:
  theme: classic
locale:
  language: en
`;

export default function ResumeBuilderPage() {
  const [yamlContent, setYamlContent] = useState<string>(initialYamlContent);
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [showGeminiOutput, setShowGeminiOutput] = useState<boolean>(false);
  const [beforeContent, setBeforeContent] = useState<string>("");

  // Parse the YAML content
  const parseYaml = (content: string) => {
    try {
      const data = yaml.load(content);
      setParsedData(data);
      setError(null);
      return data;
    } catch (e: any) {
      setError(`YAML Parsing Error: ${e.message}`);
      setParsedData(null);
      return null;
    }
  };

  // Parse initial YAML content on component mount
  useEffect(() => {
    parseYaml(initialYamlContent);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    const content = value || "";
    setYamlContent(content);
    parseYaml(content);
  };

  // Function to optimize resume using Gemini API
  const optimizeResume = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }
    
    try {
      setIsOptimizing(true);
      setError(null);
      setBeforeContent(yamlContent); // Store original content for comparison
      
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
      
      console.log("Sending prompt to Gemini:", prompt);
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log("Raw response from Gemini:", text);
      setGeminiResponse(text);
      setShowGeminiOutput(true);
      
      // Extract YAML content from response (in case there's additional text)
      let optimizedYaml = text;
      if (text.includes('```yaml')) {
        optimizedYaml = text.split('```yaml')[1].split('```')[0].trim();
        console.log("Extracted YAML (from yaml code block):", optimizedYaml);
      } else if (text.includes('```')) {
        optimizedYaml = text.split('```')[1].split('```')[0].trim();
        console.log("Extracted YAML (from generic code block):", optimizedYaml);
      } else {
        console.log("Using raw text as YAML (no code blocks found)");
      }
      
      // Validate YAML before setting
      try {
        const parsedYaml = yaml.load(optimizedYaml);
        console.log("Successfully parsed YAML:", parsedYaml);
        
        // Log the before and after to clearly show changes
        console.log("BEFORE optimization:", yamlContent);
        console.log("AFTER optimization:", optimizedYaml);
        
        setYamlContent(optimizedYaml);
        parseYaml(optimizedYaml);
      } catch (e: any) {
        console.error("YAML parsing error:", e);
        setError(`Invalid YAML returned: ${e.message}`);
      }
      
    } catch (error: any) {
      console.error("Gemini API error:", error);
      setError(`Error optimizing resume: ${error.message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Placeholder for the preview rendering logic
  const renderPreview = (data: any) => {
    if (!data) return <p className="text-gray-500">Enter valid YAML to see the preview.</p>;

    // Helper function to safely convert dates to strings
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '';
      if (typeof dateValue === 'string') return dateValue;
      // Handle date objects
      if (typeof dateValue === 'object') {
        // If it has start_date and end_date properties, it's a date range
        if (dateValue.start_date || dateValue.end_date) {
          const start = dateValue.start_date || '';
          const end = dateValue.end_date || '';
          return `${start}${start && end ? ' – ' : ''}${end}`;
        }
        // Try to convert to ISO string if it's a Date object
        if (dateValue instanceof Date) {
          return dateValue.toISOString().split('T')[0];
        }
        // If it's some other object, convert to string
        return JSON.stringify(dateValue);
      }
      return String(dateValue);
    };
    
    // Check if data uses the cv structure or the basics structure
    const useCvFormat = data?.cv !== undefined;
    const name = useCvFormat ? data?.cv?.name : data?.basics?.name;
    const label = useCvFormat ? "" : data?.basics?.label;
    const email = useCvFormat ? data?.cv?.email : data?.basics?.email;
    const phone = useCvFormat ? data?.cv?.phone : data?.basics?.phone;
    const website = useCvFormat ? data?.cv?.website : data?.basics?.website;
    const location = useCvFormat ? data?.cv?.location : data?.basics?.location?.city;
    const summary = useCvFormat ? "" : data?.basics?.summary;

    // Extract design settings
    const design = data?.design || {};
    
    // Apply design colors
    const colors = design?.colors || {};
    const textColor = colors?.text || "rgb(0, 0, 0)";
    const nameColor = colors?.name || "rgb(0, 79, 144)";
    const sectionTitleColor = colors?.section_titles || "rgb(0, 79, 144)";
    const linkColor = colors?.links || "rgb(0, 79, 144)";
    
    // Apply design text settings
    const textSettings = design?.text || {};
    const fontFamily = textSettings?.font_family || "sans-serif";
    const fontSize = textSettings?.font_size || "10pt";
    const textAlignment = textSettings?.alignment || "left";
    
    // Apply header settings
    const headerSettings = design?.header || {};
    const nameFontFamily = headerSettings?.name_font_family || fontFamily;
    const nameFontSize = headerSettings?.name_font_size || "30pt";
    const nameFontWeight = headerSettings?.name_bold ? "bold" : "normal";
    const headerAlignment = headerSettings?.alignment || "left";
    
    // Apply link settings
    const linkSettings = design?.links || {};
    const linkUnderline = linkSettings?.underline ? "underline" : "none";

    // Base styles
    const baseStyles = {
      fontFamily,
      fontSize,
      color: textColor,
      textAlign: textAlignment as any,
    };
    
    const nameStyles = {
      fontFamily: nameFontFamily,
      fontSize: nameFontSize,
      fontWeight: nameFontWeight,
      color: nameColor,
      textAlign: headerAlignment as any,
      marginBottom: "0.4em",
    };
    
    const sectionTitleStyles = {
      color: sectionTitleColor,
      borderBottomColor: sectionTitleColor,
      fontWeight: "bold",
      marginTop: "1em",
      marginBottom: "0.5em",
      paddingBottom: "0.2em",
    };
    
    const linkStyles = {
      color: linkColor,
      textDecoration: linkUnderline,
    };

    return (
      <div className="p-4 border rounded bg-white shadow" style={baseStyles}>
        <div style={{ textAlign: headerAlignment as any }}>
          <h1 style={nameStyles}>{name || "Name"}</h1>
          {label && <p style={{ marginBottom: "1em" }}>{label}</p>}
        </div>
        
        <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>Contact</h2>
        <div style={{ marginBottom: "1em" }}>
          {email && <p>Email: {email}</p>}
          {phone && <p>Phone: {phone}</p>}
          {website && <p>Website: <a href={website} target="_blank" rel="noopener noreferrer" style={linkStyles}>{website}</a></p>}
          {location && <p>Location: {location}</p>}
        </div>
        
        {/* Social networks for CV format */}
        {useCvFormat && data.cv.social_networks && data.cv.social_networks.length > 0 && (
          <div style={{ marginBottom: "1em" }}>
            <h3 style={{ fontWeight: "semibold", marginBottom: "0.5em" }}>Social Networks</h3>
            <ul style={{ listStyleType: "disc", paddingLeft: "1.5em" }}>
              {data.cv.social_networks.map((social: any, index: number) => (
                <li key={index}>
                  {social.network}: {social.username}
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary && (
          <>
            <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>Summary</h2>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: "1em" }}>{summary}</p>
          </>
        )}

        {/* Render sections for CV format */}
        {useCvFormat && data.cv.sections && Object.keys(data.cv.sections).length > 0 && (
          <>
            {Object.entries(data.cv.sections).map(([sectionTitle, sectionContent]: [string, any]) => (
              <div key={sectionTitle} style={{ marginBottom: "1em" }}>
                <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>
                  {sectionTitle.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </h2>
                
                {Array.isArray(sectionContent) && sectionContent.map((entry: any, entryIndex: number) => {
                  // Handle different entry types
                  if (typeof entry === 'string') {
                    // TextEntry
                    return (
                      <p key={entryIndex} style={{ marginBottom: "0.5em" }}>
                        {entry}
                      </p>
                    );
                  } else if (entry.bullet) {
                    // BulletEntry
                    return (
                      <ul key={entryIndex} style={{ listStyleType: "disc", paddingLeft: "1.5em", marginBottom: "0.5em" }}>
                        <li>{entry.bullet}</li>
                      </ul>
                    );
                  } else if (entry.number) {
                    // NumberedEntry
                    return (
                      <ol key={entryIndex} style={{ listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "0.5em" }}>
                        <li>{entry.number}</li>
                      </ol>
                    );
                  } else if (entry.reversed_number) {
                    // ReversedNumberedEntry
                    return (
                      <ol key={entryIndex} style={{ listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "0.5em" }}>
                        <li>{entry.reversed_number}</li>
                      </ol>
                    );
                  } else if (entry.label && entry.details) {
                    // OneLineEntry
                    return (
                      <p key={entryIndex} style={{ marginBottom: "0.5em" }}>
                        <strong>{entry.label}:</strong> {entry.details}
                      </p>
                    );
                  } else if (entry.institution) {
                    // EducationEntry
                    return (
                      <div key={entryIndex} style={{ marginBottom: "1em" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontWeight: "bold" }}>{entry.institution}</p>
                            {entry.area && <p>{entry.area} {entry.degree && `(${entry.degree})`}</p>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {entry.location && <p>{entry.location}</p>}
                            {(entry.start_date || entry.end_date) && 
                              <p>
                                {formatDate(entry.start_date)} {entry.start_date && entry.end_date && "–"} {formatDate(entry.end_date)}
                              </p>
                            }
                            {entry.date && <p>{formatDate(entry.date)}</p>}
                          </div>
                        </div>
                        {entry.summary && <p style={{ marginTop: "0.5em" }}>{entry.summary}</p>}
                        {entry.highlights && Array.isArray(entry.highlights) && (
                          <ul style={{ listStyleType: "disc", paddingLeft: "1.5em", marginTop: "0.5em" }}>
                            {entry.highlights.map((highlight: string, i: number) => (
                              <li key={i}>{highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else if (entry.company) {
                    // ExperienceEntry
                    return (
                      <div key={entryIndex} style={{ marginBottom: "1em" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontWeight: "bold" }}>{entry.company}</p>
                            {entry.position && <p>{entry.position}</p>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {entry.location && <p>{entry.location}</p>}
                            {(entry.start_date || entry.end_date) && 
                              <p>
                                {formatDate(entry.start_date)} {entry.start_date && entry.end_date && "–"} {formatDate(entry.end_date)}
                              </p>
                            }
                            {entry.date && <p>{formatDate(entry.date)}</p>}
                          </div>
                        </div>
                        {entry.summary && <p style={{ marginTop: "0.5em" }}>{entry.summary}</p>}
                        {entry.highlights && Array.isArray(entry.highlights) && (
                          <ul style={{ listStyleType: "disc", paddingLeft: "1.5em", marginTop: "0.5em" }}>
                            {entry.highlights.map((highlight: string, i: number) => (
                              <li key={i}>{highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else if (entry.name) {
                    // NormalEntry
                    return (
                      <div key={entryIndex} style={{ marginBottom: "1em" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontWeight: "bold" }}>{entry.name}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {entry.location && <p>{entry.location}</p>}
                            {(entry.start_date || entry.end_date) && 
                              <p>
                                {formatDate(entry.start_date)} {entry.start_date && entry.end_date && "–"} {formatDate(entry.end_date)}
                              </p>
                            }
                            {entry.date && <p>{formatDate(entry.date)}</p>}
                          </div>
                        </div>
                        {entry.summary && <p style={{ marginTop: "0.5em" }}>{entry.summary}</p>}
                        {entry.highlights && Array.isArray(entry.highlights) && (
                          <ul style={{ listStyleType: "disc", paddingLeft: "1.5em", marginTop: "0.5em" }}>
                            {entry.highlights.map((highlight: string, i: number) => (
                              <li key={i}>{highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  } else if (entry.title && entry.authors) {
                    // PublicationEntry
                    return (
                      <div key={entryIndex} style={{ marginBottom: "1em" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <p style={{ fontWeight: "bold" }}>{entry.title}</p>
                            {entry.authors && <p>{Array.isArray(entry.authors) ? entry.authors.join(", ") : entry.authors}</p>}
                            {entry.journal && <p>{entry.journal}</p>}
                            {entry.url && <p><a href={entry.url} style={linkStyles} target="_blank" rel="noopener noreferrer">Link</a></p>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {entry.date && <p>{formatDate(entry.date)}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // Unknown entry type, render as JSON
                    return (
                      <pre key={entryIndex} style={{ fontSize: "0.8em", backgroundColor: "#f0f0f0", padding: "0.5em", borderRadius: "0.25em", marginTop: "0.5em", marginBottom: "0.5em", overflow: "auto" }}>
                        {JSON.stringify(entry, null, 2)}
                      </pre>
                    );
                  }
                })}
              </div>
            ))}
          </>
        )}

        {/* Old format sections */}
        {data?.work && data.work.length > 0 && (
          <>
            <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>Work Experience</h2>
            {data.work.map((job: any, index: number) => (
              <div key={index} style={{ marginBottom: "1em" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontWeight: "bold" }}>{job.company}</p>
                    {job.position && <p>{job.position}</p>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p>
                      {formatDate(job.startDate)} {job.startDate && job.endDate && "–"} {formatDate(job.endDate)}
                    </p>
                  </div>
                </div>
                {job.summary && <p style={{ whiteSpace: "pre-wrap", marginTop: "0.5em" }}>{job.summary}</p>}
              </div>
            ))}
          </>
        )}

        {data?.education && data.education.length > 0 && (
          <>
            <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} style={{ marginBottom: "1em" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontWeight: "bold" }}>{edu.institution}</p>
                    <p>{edu.area} {edu.studyType && `(${edu.studyType})`}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p>
                      {formatDate(edu.startDate)} {edu.startDate && edu.endDate && "–"} {formatDate(edu.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {data?.skills && data.skills.length > 0 && (
          <>
            <h2 style={{ ...sectionTitleStyles, borderBottom: `1px solid ${sectionTitleColor}` }}>Skills</h2>
            {data.skills.map((skill: any, index: number) => (
              <div key={index} style={{ marginBottom: "0.5em" }}>
                <p style={{ fontWeight: "medium" }}>{skill.name}</p>
                {skill.keywords && skill.keywords.length > 0 && (
                  <p>{skill.keywords.join(", ")}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Placeholder) */}
      <aside className="w-1/5 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Options</h2>
        {/* Add theme selection, download buttons, etc. here */}
        <p>Theme: Classic</p>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">AI Resume Optimization</h3>
          {showApiKeyInput ? (
            <div className="mb-3">
              <label className="block text-sm mb-1">Gemini API Key</label>
              <input 
                type="password" 
                className="w-full p-2 text-black rounded mb-2"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Save Key
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm mb-3"
            >
              {apiKey ? "Change API Key" : "Set API Key"}
            </button>
          )}
          
          <label className="block text-sm mb-1">Job Description</label>
          <textarea
            className="w-full p-2 text-black rounded mb-3"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={optimizeResume}
            disabled={isOptimizing || !apiKey}
          >
            {isOptimizing ? "Optimizing..." : "Optimize Resume for Job"}
          </button>
          
          {geminiResponse && (
            <div className="mt-4">
              <button
                onClick={() => setShowGeminiOutput(!showGeminiOutput)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {showGeminiOutput ? "Hide Gemini Output" : "Show Gemini Output"}
              </button>
            </div>
          )}
        </div>
        
        <button className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Download PDF
        </button>
      </aside>

      {/* Editor Pane */}
      <main className="w-2/5 flex flex-col">
        <div className="p-2 bg-gray-200 border-b border-gray-300">
          <span className="font-semibold">Resume Data (YAML)</span>
        </div>
        <div className="flex-grow relative">
          {error && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-2 z-10" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {showGeminiOutput && geminiResponse && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 text-white p-4 z-20 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Gemini AI Response</h3>
                <button 
                  onClick={() => setShowGeminiOutput(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Close
                </button>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-yellow-400">Raw Response:</h4>
                <pre className="bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap">{geminiResponse}</pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400">Before Optimization:</h4>
                  <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto max-h-[400px]">{beforeContent}</pre>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400">After Optimization:</h4>
                  <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto max-h-[400px]">{yamlContent}</pre>
                </div>
              </div>
            </div>
          )}
          <Editor
            height="100%" // Use full available height
            defaultLanguage="yaml"
            value={yamlContent}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on", // Enable word wrap
            }}
            theme="vs-dark" // Or use a light theme like "vs-light"
          />
        </div>
      </main>

      {/* Preview Pane */}
      <aside className="w-2/5 bg-gray-200 p-4 overflow-y-auto">
         <div className="p-2 bg-white border-b border-gray-300 sticky top-0 z-10">
           <span className="font-semibold">Preview</span>
         </div>
        <div className="mt-2">
         {renderPreview(parsedData)}
        </div>
      </aside>
    </div>
  );
} 
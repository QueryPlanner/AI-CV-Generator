import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the themes directory - adjusted for server-side Node.js
const THEMES_DIR = path.join(process.cwd(), 'lib', 'themes');

// This is a simple placeholder API that will acknowledge a theme change 
// but returns minimal data as we're moving away from API-based themes
export async function GET(
  request: NextRequest,
  { params }: { params: { theme: string } }
) {
  try {
    const theme = params.theme;
    const filePath = path.join(THEMES_DIR, `${theme}.yaml`);
    
    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: `Theme '${theme}' not found` },
        { status: 404 }
      );
    }
    
    // Read the YAML file content (but don't parse it)
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Return just the file content, not parsed
    return NextResponse.json({ content: fileContent, theme: theme });
  } catch (error) {
    console.error(`Error in theme API route for ${params.theme}:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve theme', details: (error as Error).message },
      { status: 500 }
    );
  }
} 
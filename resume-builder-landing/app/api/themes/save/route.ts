import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the themes directory
const THEMES_DIR = path.join(process.cwd(), 'lib', 'themes');

export async function POST(request: NextRequest) {
  try {
    // Ensure the themes directory exists
    try {
      await fs.access(THEMES_DIR);
    } catch (error) {
      await fs.mkdir(THEMES_DIR, { recursive: true });
    }
    
    // Get the request data
    const data = await request.json();
    
    // Validate the input
    if (!data.theme_name || !data.yaml_content) {
      return NextResponse.json(
        { error: 'Missing theme_name or yaml_content' },
        { status: 400 }
      );
    }
    
    // Validate theme name
    if (!/^[a-zA-Z0-9_]+$/.test(data.theme_name)) {
      return NextResponse.json(
        { error: 'Theme name can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }
    
    // Write the file
    const filePath = path.join(THEMES_DIR, `${data.theme_name}.yaml`);
    await fs.writeFile(filePath, data.yaml_content, 'utf-8');
    
    return NextResponse.json({
      message: `Theme '${data.theme_name}' saved successfully`
    });
  } catch (error) {
    console.error('Error in save theme API route:', error);
    return NextResponse.json(
      { error: 'Failed to save theme', details: (error as Error).message },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the themes directory
const THEMES_DIR = path.join(process.cwd(), 'lib', 'themes');

export async function DELETE(
  request: NextRequest,
  { params }: { params: { theme: string } }
) {
  try {
    const theme = params.theme;
    const filePath = path.join(THEMES_DIR, `${theme}.yaml`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: `Theme '${theme}' not found` },
        { status: 404 }
      );
    }
    
    // Don't allow deletion of built-in themes
    if (theme === 'classic' || theme === 'moderncv') {
      return NextResponse.json(
        { error: `Cannot delete built-in theme '${theme}'` },
        { status: 403 }
      );
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    return NextResponse.json({
      message: `Theme '${theme}' deleted successfully`
    });
  } catch (error) {
    console.error(`Error in delete theme API route for ${params.theme}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete theme', details: (error as Error).message },
      { status: 500 }
    );
  }
} 
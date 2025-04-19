import { NextRequest, NextResponse } from 'next/server';

// Hardcoded list of available themes
const AVAILABLE_THEMES = ['classic', 'moderncv'];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      themes: AVAILABLE_THEMES
    });
  } catch (error) {
    console.error('Error in themes API route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve themes' },
      { status: 500 }
    );
  }
} 
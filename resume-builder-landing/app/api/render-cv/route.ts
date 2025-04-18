import { NextRequest, NextResponse } from 'next/server';

// The backend Flask API URL - adjust this to your deployment setup
const FLASK_API_URL = 'http://localhost:8000/render_live';

export async function POST(request: NextRequest) {
  try {
    // Get YAML content from request
    const requestData = await request.json();
    
    if (!requestData.yamlContent) {
      return NextResponse.json(
        { error: 'YAML content is required' },
        { status: 400 }
      );
    }

    // Forward the request to Flask backend
    const response = await fetch(FLASK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        yaml_content: requestData.yamlContent,
      }),
    });

    // If response is not OK, handle the error
    if (!response.ok) {
      let errorData;
      
      try {
        errorData = await response.json();
      } catch (e) {
        // If not JSON, get the text
        const errorText = await response.text();
        errorData = { 
          error: `Server returned status ${response.status}`, 
          details: [`Response: ${errorText.substring(0, 500)}`] 
        };
      }
      
      return NextResponse.json(errorData, { status: response.status });
    }

    // For PDF responses, we need to pass the binary data
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      const pdfBuffer = await response.arrayBuffer();
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
    }

    // For any other response type (like JSON)
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in render-cv API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: [(error as Error).message] },
      { status: 500 }
    );
  }
} 
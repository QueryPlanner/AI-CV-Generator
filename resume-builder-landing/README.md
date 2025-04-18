# Resume Builder with RenderCV Integration

This project combines a Next.js frontend resume builder with a Flask backend for PDF generation using RenderCV and Typst.

## Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- Typst (must be installed and available in PATH)
- RenderCV Python package

## Setup

### 1. Frontend Setup (Next.js)

```bash
# Navigate to the frontend directory
cd resume-builder-landing

# Install dependencies
npm install

# Create an environment file
cp .env.example .env.local
```

Update your `.env.local` file with your Google Gemini API key:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

You can obtain a Gemini API key by visiting: https://ai.google.dev/ and signing up for access.

```bash
# Run the development server
npm run dev
```

The Next.js app will be available at http://localhost:3000

### 2. Backend Setup (Flask API)

```bash
# Navigate to the API directory
cd ../API

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask rendercv

# Run the Flask server
python app.py
```

The Flask API will be available at http://localhost:8000

## Features

- **Resume Builder**: Create and edit resumes with a visual preview
- **AI Optimization**: Use AI to optimize your resume for specific job descriptions
- **RenderCV Integration**: Generate professional PDFs using RenderCV and Typst
- **YAML Editor**: Configure resume details with a powerful YAML editor

## How to Use RenderCV Integration

1. Navigate to the RenderCV PDF Generator page
2. Edit the YAML in the editor
3. Click "Render PDF" to generate a preview
4. Download the PDF when you're satisfied with the result

## Architecture

- **Frontend**: Next.js with React, TypeScript, and TailwindCSS
- **Backend**: Flask API that utilizes RenderCV and Typst
- **Communication**: The frontend makes API calls to the backend to generate PDFs

## Troubleshooting

### PDF Generation Issues

- Make sure Typst is properly installed and available in your PATH
- Check that RenderCV is installed in your Python environment
- Verify that the YAML syntax is correct

### API Connection Issues

- Ensure both the frontend and backend are running
- The frontend expects the API at http://localhost:8000, adjust as needed 
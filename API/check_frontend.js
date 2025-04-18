/**
 * Check if the Next.js frontend properly integrates with the RenderCV API
 * and displays PDFs with icons.
 * 
 * Run with: node check_frontend.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Paths to check
const possibleFrontendPaths = [
  '../resume-builder-landing',
  './resume-builder-landing',
  'resume-builder-landing'
];

// Check if frontend directory exists
function findFrontendDir() {
  for (const dirPath of possibleFrontendPaths) {
    if (fs.existsSync(dirPath)) {
      console.log(`Found frontend directory at: ${dirPath}`);
      return dirPath;
    }
  }
  console.error('Could not find Next.js frontend directory');
  return null;
}

// Check .env files
function checkEnvFiles(frontendDir) {
  console.log('\nChecking environment configuration...');
  const envLocalPath = path.join(frontendDir, '.env.local');
  const envExamplePath = path.join(frontendDir, '.env.example');
  
  let apiUrl = null;
  
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    console.log('.env.local exists');
    
    // Extract API_URL
    const match = envContent.match(/API_URL=(.+)/);
    if (match) {
      apiUrl = match[1].trim();
      console.log(`API_URL is configured to: ${apiUrl}`);
    } else {
      console.warn('Warning: API_URL not found in .env.local');
    }
  } else {
    console.warn('Warning: .env.local file not found');
    
    if (fs.existsSync(envExamplePath)) {
      console.log('.env.example exists, but .env.local needs to be created');
    }
  }
  
  return apiUrl;
}

// Check if API server is running
async function checkApiServer(apiUrl) {
  if (!apiUrl) return false;
  
  console.log(`\nChecking if API server is running at ${apiUrl}...`);
  
  return new Promise((resolve) => {
    const client = apiUrl.startsWith('https') ? https : http;
    const req = client.get(apiUrl, (res) => {
      console.log(`API server response status: ${res.statusCode}`);
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    
    req.on('error', (err) => {
      console.error(`Error connecting to API: ${err.message}`);
      resolve(false);
    });
    
    // Set a timeout
    req.setTimeout(5000, () => {
      console.error('Connection to API timed out');
      req.abort();
      resolve(false);
    });
  });
}

// Test API with a YAML that includes icons
async function testApiWithIcons(apiUrl) {
  if (!apiUrl) return false;
  
  const renderEndpoint = `${apiUrl}/render_live`.replace(/\/+$/, '');
  console.log(`\nTesting API rendering with icons at ${renderEndpoint}...`);
  
  // Sample YAML with social networks that should use icons
  const testYaml = `
cv:
  name: "Test User"
  location: "Test Location"
  email: "test@example.com"
  social_networks:
    - network: "GitHub"
      username: "testuser"
    - network: "LinkedIn"
      username: "testuser"
  sections: {}
design:
  header:
    use_icons_for_connections: true
`;

  return new Promise((resolve) => {
    const url = new URL(renderEndpoint);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      console.log(`API render endpoint response status: ${res.statusCode}`);
      
      let data = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const contentType = res.headers['content-type'];
          console.log(`Content-Type: ${contentType}`);
          
          if (contentType && contentType.includes('application/pdf')) {
            const pdfBuffer = Buffer.concat(data);
            fs.writeFileSync('frontend_test.pdf', pdfBuffer);
            console.log('Successfully received and saved PDF to frontend_test.pdf');
            
            // Check for icon warning header
            if (res.headers['x-icon-warning'] === 'true') {
              console.warn('Warning: API reports that icons may not render correctly');
              resolve(false);
            } else {
              console.log('No icon warnings reported by API');
              resolve(true);
            }
          } else {
            console.error(`Received non-PDF response: ${contentType}`);
            resolve(false);
          }
        } else {
          // Try to parse error response
          try {
            const errorText = Buffer.concat(data).toString();
            console.error(`API error: ${errorText.substring(0, 500)}`);
          } catch (e) {
            console.error('Could not parse error response');
          }
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error(`Error sending request to API: ${err.message}`);
      resolve(false);
    });
    
    // Send the request
    req.write(JSON.stringify({ yaml_content: testYaml }));
    req.end();
    
    // Set a timeout
    req.setTimeout(10000, () => {
      console.error('Request to API timed out');
      req.abort();
      resolve(false);
    });
  });
}

// Check package.json for dependencies
function checkPackageJson(frontendDir) {
  console.log('\nChecking frontend dependencies...');
  const packageJsonPath = path.join(frontendDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for PDF viewing libraries
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const pdfLibs = Object.keys(deps).filter(dep => 
        dep.toLowerCase().includes('pdf') || 
        dep.includes('react-pdf') || 
        dep.includes('pdfjs')
      );
      
      if (pdfLibs.length > 0) {
        console.log(`Found PDF-related dependencies: ${pdfLibs.join(', ')}`);
        return true;
      } else {
        console.warn('Warning: No PDF viewer libraries found in dependencies');
        return false;
      }
    } catch (e) {
      console.error(`Error parsing package.json: ${e.message}`);
      return false;
    }
  } else {
    console.error(`package.json not found at ${packageJsonPath}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Checking Next.js Frontend Integration ===');
  
  // Step 1: Find frontend directory
  const frontendDir = findFrontendDir();
  if (!frontendDir) {
    console.error('Frontend check failed: directory not found');
    process.exit(1);
  }
  
  // Step 2: Check environment configuration
  const apiUrl = checkEnvFiles(frontendDir);
  
  // Step 3: Check if API server is running
  const apiRunning = await checkApiServer(apiUrl);
  
  // Step 4: Test API with icons
  const iconTest = apiRunning ? await testApiWithIcons(apiUrl) : false;
  
  // Step 5: Check frontend dependencies
  const hasViewer = checkPackageJson(frontendDir);
  
  // Print summary
  console.log('\n=== Frontend Integration Summary ===');
  console.log(`Frontend Directory: ${frontendDir ? '✅' : '❌'}`);
  console.log(`API URL Configured: ${apiUrl ? '✅' : '❌'}`);
  console.log(`API Server Running: ${apiRunning ? '✅' : '❌'}`);
  console.log(`Icon Rendering Test: ${iconTest ? '✅' : '❌'}`);
  console.log(`PDF Viewer Dependencies: ${hasViewer ? '✅' : '❌'}`);
  
  if (apiUrl && apiRunning && iconTest && hasViewer) {
    console.log('\nAll frontend integration tests passed!');
    console.log('Your Next.js app should be able to display CVs with icons correctly.');
  } else {
    console.log('\nSome frontend integration tests failed.');
    console.log('Check the warnings above and follow instructions to fix issues.');
    
    if (!apiUrl) {
      console.log('\nTo fix API URL configuration:');
      console.log(`1. Create or edit ${path.join(frontendDir, '.env.local')}`);
      console.log('2. Add the line: API_URL=http://localhost:8000');
    }
    
    if (!apiRunning) {
      console.log('\nTo start the API server:');
      console.log('1. Open a terminal in the API directory');
      console.log('2. Run: python app.py');
    }
    
    if (!iconTest && apiRunning) {
      console.log('\nTo fix icon rendering:');
      console.log('1. Run: python setup_fonts.py');
      console.log('2. Set environment variable: export RENDERCV_FONT_PATH=/path/to/fonts');
      console.log('3. Restart the API server');
    }
    
    if (!hasViewer) {
      console.log('\nTo add PDF viewing capabilities:');
      console.log('1. Install a PDF viewer library: npm install react-pdf');
      console.log('2. Make sure your components properly display the PDF');
    }
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 
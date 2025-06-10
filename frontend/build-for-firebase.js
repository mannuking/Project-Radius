const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

console.log(`${colors.bright}${colors.cyan}=== Building for Firebase Hosting ===${colors.reset}\n`);

// Step 1: Run Next.js build
try {
  console.log(`${colors.yellow}Step 1: Running Next.js build...${colors.reset}`);
  execSync('pnpm next build', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Next.js build completed${colors.reset}\n`);
  
  // Next.js 13+ handles export via 'output: export' in next.config.js
  // No need to run 'next export' separately
} catch (error) {
  console.error(`${colors.red}✗ Next.js build failed: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Step 2: Ensure 404.html exists (create copy of index.html if needed)
try {
  console.log(`${colors.yellow}Step 2: Setting up 404 page...${colors.reset}`);
  const outDir = path.join(__dirname, 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`Created output directory: ${outDir}`);
  }
    // Check if index.html exists, if not create a simple one
  const indexHtmlPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('index.html not found, creating a simple one...');
    fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Project Radius</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages or Firebase Hosting
      // https://github.com/rafrex/spa-github-pages
      // This script handles routing for SPA on Firebase Hosting
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      }(window.location))
    </script>
  </head>
  <body>
    <div id="root">
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center;">
          <h1>Loading Project Radius...</h1>
          <p>If this message persists, please check the browser console for errors.</p>
        </div>
      </div>
    </div>
  </body>
</html>`);
  }
  // Create proper 404.html
  console.log('Creating proper 404.html file...');
  fs.writeFileSync(path.join(outDir, '404.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Radius - Page Not Found</title>
    <script type="text/javascript">
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>Redirecting...</h1>
      <p>If you're not automatically redirected, <a href="/">click here to return to the homepage</a>.</p>
    </div>
  </body>
</html>`);
  
  console.log(`${colors.green}✓ 404 page setup completed${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to set up 404 page: ${error.message}${colors.reset}`);
  // Continue anyway
}

// Step 3: Create a Firebase deployment file if it doesn't exist
try {
  console.log(`${colors.yellow}Step 3: Ensuring Firebase configuration...${colors.reset}`);
  
  // Make sure firebase.json exists
  const firebaseJsonPath = path.join(__dirname, 'firebase.json');
  if (!fs.existsSync(firebaseJsonPath)) {
    const defaultConfig = {
      "hosting": {
        "public": "out",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "cleanUrls": true,
        "trailingSlash": false,
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    };
    
    fs.writeFileSync(firebaseJsonPath, JSON.stringify(defaultConfig, null, 2));
    console.log('Created default firebase.json');
  }
  
  console.log(`${colors.green}✓ Firebase configuration verified${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to verify Firebase configuration: ${error.message}${colors.reset}`);
  // Continue anyway
}

console.log(`${colors.bright}${colors.green}=== Build completed successfully! ===${colors.reset}`);
console.log(`${colors.cyan}You can now deploy with: ${colors.bright}firebase deploy --only hosting${colors.reset}`); 

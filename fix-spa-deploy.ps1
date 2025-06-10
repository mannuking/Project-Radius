# SPA Fix for Firebase Deployment

# Update firebase.json
Write-Host "Updating firebase.json..." -ForegroundColor Cyan
$firebaseJsonPath = "e:\Projects\Project-Radius\firebase.json"
$firebaseJson = Get-Content $firebaseJsonPath | ConvertFrom-Json

# Update rewrites
$firebaseJson.hosting.rewrites = @(
    @{
        "source" = "/api/**"
        "function" = "api"
    },
    @{
        "source" = "**"
        "destination" = "/index.html"
    }
)

# Save the file
$firebaseJson | ConvertTo-Json -Depth 10 | Set-Content $firebaseJsonPath
Write-Host "✓ firebase.json updated" -ForegroundColor Green

# Fix the index.html file
Write-Host "Fixing index.html..." -ForegroundColor Cyan 
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Radius - AR Tracker</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages or Firebase Hosting
      // This script handles routes for SPA deployed to Firebase
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      }(window.location));
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
</html>
"@

$indexHtmlPath = "e:\Projects\Project-Radius\frontend\out\index.html"
# Create the directory if it doesn't exist
if (-not (Test-Path "e:\Projects\Project-Radius\frontend\out")) {
    New-Item -ItemType Directory -Path "e:\Projects\Project-Radius\frontend\out" -Force | Out-Null
}
Set-Content -Path $indexHtmlPath -Value $indexHtml
Write-Host "✓ index.html updated" -ForegroundColor Green

# Create a proper 404.html file
Write-Host "Creating 404.html..." -ForegroundColor Cyan
$notFoundHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Radius - Page Not Found</title>
    <script type="text/javascript">
      // Single-page app routing that handles 404s
      var segmentCount = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
        l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <div style="text-align: center; padding: 40px;">
      <h1>Page Not Found</h1>
      <p>Redirecting...</p>
    </div>
  </body>
</html>
"@
Set-Content -Path "e:\Projects\Project-Radius\frontend\out\404.html" -Value $notFoundHtml
Write-Host "✓ 404.html created" -ForegroundColor Green

# Deploy only hosting to Firebase
Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Cyan
Set-Location -Path "e:\Projects\Project-Radius"
firebase deploy --only hosting --project ar-tracker-c226f

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your site should now be available at: https://ar-tracker-c226f.web.app" -ForegroundColor Cyan
Write-Host "Clear your browser cache or use an incognito window to test" -ForegroundColor Yellow

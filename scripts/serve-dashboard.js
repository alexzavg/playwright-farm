const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const PORT = 8080;
const REPORT_DIR = path.join(process.cwd(), 'report');
const RESULTS_DIR = path.join(process.cwd(), 'test-results');

// Generate dashboard first
const resultsPath = path.join(REPORT_DIR, 'funnel-results.json');

if (!fs.existsSync(resultsPath)) {
  console.error('❌ No results found. Run tests first: npm run test:load');
  process.exit(1);
}

// Kill any existing process on port
try {
  const pid = execSync(`lsof -ti:${PORT}`, { encoding: 'utf-8' }).trim();
  if (pid) {
    execSync(`kill -9 ${pid}`);
    console.log(`Killed existing process on port ${PORT}`);
  }
} catch (e) {}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

const dashboardHTML = generateDashboard(results);
fs.writeFileSync(path.join(REPORT_DIR, 'dashboard.html'), dashboardHTML);

// Serve files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.zip': 'application/zip',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webm': 'video/webm',
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    res.end();
    return;
  }

  // API to open trace viewer
  if (req.url.startsWith('/api/show-trace?')) {
    const tracePath = decodeURIComponent(req.url.split('path=')[1]);
    const fullPath = path.join(process.cwd(), tracePath);
    
    if (fs.existsSync(fullPath)) {
      const { spawn } = require('child_process');
      spawn('npx', ['playwright', 'show-trace', fullPath], { 
        detached: true, 
        stdio: 'ignore' 
      }).unref();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Trace not found' }));
    }
    return;
  }

  let filePath;
  
  if (req.url === '/' || req.url === '/dashboard.html') {
    filePath = path.join(REPORT_DIR, 'dashboard.html');
  } else if (req.url.startsWith('/test-results/')) {
    filePath = path.join(process.cwd(), req.url);
  } else {
    filePath = path.join(REPORT_DIR, req.url);
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  res.writeHead(200, { 
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n📊 Dashboard ready at http://localhost:${PORT}\n`);
  
  // Open in browser
  try {
    execSync(`open http://localhost:${PORT}`);
  } catch (e) {}
});

function generateDashboard(results) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Funnel Load Test Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a; color: #e2e8f0; padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { margin-bottom: 20px; color: #f8fafc; }
    
    .stats {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #1e293b; padding: 20px; border-radius: 12px;
      text-align: center;
    }
    .stat-value { font-size: 36px; font-weight: bold; }
    .stat-label { color: #94a3b8; margin-top: 5px; }
    .stat-card.passed .stat-value { color: #4ade80; }
    .stat-card.failed .stat-value { color: #f87171; }
    .stat-card.rate .stat-value { color: #60a5fa; }
    
    .failures-section { margin-top: 30px; }
    .failures-section h2 { margin-bottom: 15px; color: #f87171; }
    
    .spec-group {
      background: #1e293b; border-radius: 12px; margin-bottom: 15px;
      overflow: hidden;
    }
    .spec-header {
      padding: 15px 20px; cursor: pointer; display: flex;
      justify-content: space-between; align-items: center;
      background: #7c3aed; transition: background 0.2s;
    }
    .spec-header:hover { background: #6d28d9; }
    .spec-name { font-weight: 600; font-size: 16px; }
    .spec-count {
      background: rgba(255,255,255,0.2); color: white; padding: 4px 12px;
      border-radius: 20px; font-size: 14px;
    }
    .spec-content { display: none; }
    .spec-group.open .spec-content { display: block; }
    .spec-group.open .spec-header { border-bottom: 1px solid #6d28d9; }
    
    .step-group { border-top: 1px solid #334155; }
    .step-header {
      padding: 12px 20px 12px 30px; cursor: pointer; display: flex;
      justify-content: space-between; align-items: center;
      background: #334155; transition: background 0.2s;
    }
    .step-header:hover { background: #475569; }
    .step-name { font-weight: 600; font-size: 14px; color: #f87171; }
    .step-count {
      background: #ef4444; color: white; padding: 3px 10px;
      border-radius: 15px; font-size: 12px;
    }
    .step-content { display: none; }
    .step-group.open .step-content { display: block; }
    .step-group.open .step-header { background: #475569; }
    
    .error-group { border-top: 1px solid #1e293b; }
    .error-header {
      padding: 10px 20px 10px 50px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      transition: background 0.2s;
    }
    .error-header:hover { background: #334155; }
    .error-message {
      color: #fbbf24; font-family: monospace; font-size: 12px;
      flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .error-count {
      background: #f59e0b; color: #1e293b; padding: 2px 8px;
      border-radius: 10px; font-size: 11px; margin-left: 10px; flex-shrink: 0;
    }
    
    .traces-list { display: none; padding: 10px 20px 15px 70px; }
    .error-group.open .traces-list { display: block; }
    .error-group.open .error-header { background: #334155; }
    
    .trace-item {
      background: #0f172a; padding: 10px 15px; border-radius: 8px;
      margin-bottom: 8px; display: flex; justify-content: space-between;
      align-items: center;
    }
    .trace-info { font-size: 12px; color: #94a3b8; }
    .trace-link {
      background: #3b82f6; color: white; padding: 5px 10px;
      border-radius: 6px; text-decoration: none; font-size: 11px;
      transition: all 0.2s; border: none; cursor: pointer;
    }
    .trace-link:hover { background: #2563eb; }
    .trace-link:disabled { opacity: 0.7; cursor: wait; }
    .trace-link.viewed { background: #22c55e; }
    .trace-link.viewed:hover { background: #16a34a; }
    
    .no-failures {
      text-align: center; padding: 40px; color: #4ade80;
      background: #1e293b; border-radius: 12px;
    }
    .no-failures span { font-size: 48px; display: block; margin-bottom: 10px; }
    
    .arrow { transition: transform 0.2s; margin-right: 8px; }
    .spec-group.open > .spec-header .arrow,
    .step-group.open > .step-header .arrow,
    .error-group.open > .error-header .arrow { transform: rotate(90deg); }
    
    </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Funnel Load Test Dashboard</h1>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${results.total}</div>
        <div class="stat-label">Total Runs</div>
      </div>
      <div class="stat-card passed">
        <div class="stat-value">${results.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat-card failed">
        <div class="stat-value">${results.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat-card rate">
        <div class="stat-value">${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0}%</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>

    <div class="failures-section">
      <h2>⚠️ Failures by Spec</h2>
      ${generateFailuresHTML(results.failures)}
    </div>
  </div>

  <script>
    document.querySelectorAll('.spec-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
      });
    });
    
    document.querySelectorAll('.step-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        header.parentElement.classList.toggle('open');
      });
    });
    
    document.querySelectorAll('.error-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        header.parentElement.classList.toggle('open');
      });
    });

    function openTraceViewer(tracePath, btn) {
      // Mark button as loading
      const originalText = btn.textContent;
      btn.textContent = '⏳ Opening...';
      btn.disabled = true;
      
      // Check if running on HTTPS (S3/remote) or localhost
      const isRemote = window.location.protocol === 'https:';
      
      if (isRemote) {
        // For S3/remote: open trace.playwright.dev with full URL
        const fullUrl = window.location.origin + tracePath;
        const viewerUrl = 'https://trace.playwright.dev/?trace=' + encodeURIComponent(fullUrl);
        window.open(viewerUrl, '_blank');
        btn.textContent = '✅ Viewed';
        btn.classList.add('viewed');
        btn.disabled = false;
      } else {
        // For localhost: use local Playwright trace viewer
        fetch('/api/show-trace?path=' + encodeURIComponent(tracePath))
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              btn.textContent = '✅ Viewed';
              btn.classList.add('viewed');
              btn.disabled = false;
            } else {
              btn.textContent = originalText;
              btn.disabled = false;
              alert('Could not open trace: ' + data.error);
            }
          })
          .catch(err => {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Error: ' + err.message);
          });
      }
    }
  </script>
</body>
</html>`;
}

function generateFailuresHTML(failures) {
  const specs = Object.keys(failures);
  
  if (specs.length === 0) {
    return '<div class="no-failures"><span>✅</span>All tests passed!</div>';
  }
  
  return specs.map(specName => {
    const steps = failures[specName];
    const totalForSpec = Object.values(steps).reduce((sum, step) => 
      sum + Object.values(step).reduce((s, e) => s + e.count, 0), 0);
    
    const stepsHTML = Object.keys(steps).map(stepName => {
      const errors = steps[stepName];
      const totalForStep = Object.values(errors).reduce((sum, e) => sum + e.count, 0);
      
      const errorsHTML = Object.keys(errors).map(errorMsg => {
        const errorData = errors[errorMsg];
        
        const tracesHTML = errorData.traces.map((t, idx) => {
          const tracePath = t.trace ? `/test-results/${t.trace.replace('test-results/', '')}` : '#';
          const runNum = idx + 1;
          const btnId = 'trace-btn-' + Math.random().toString(36).substr(2, 9);
          return `
          <div class="trace-item">
            <span class="trace-info">Run #${runNum}</span>
            <button class="trace-link" id="${btnId}" onclick="openTraceViewer('${tracePath}', this)">📋 View Trace</button>
          </div>
        `;
        }).join('');
        
        return `
          <div class="error-group">
            <div class="error-header">
              <span class="arrow">▶</span>
              <span class="error-message" title="${escapeHtml(errorMsg)}">${escapeHtml(errorMsg)}</span>
              <span class="error-count">${errorData.count}x</span>
            </div>
            <div class="traces-list">
              ${tracesHTML || '<div class="trace-item">No traces available</div>'}
            </div>
          </div>
        `;
      }).join('');
      
      return `
        <div class="step-group">
          <div class="step-header">
            <span class="step-name"><span class="arrow">▶</span> ${escapeHtml(stepName)}</span>
            <span class="step-count">${totalForStep}x</span>
          </div>
          <div class="step-content">
            ${errorsHTML}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="spec-group">
        <div class="spec-header">
          <span class="spec-name"><span class="arrow">▶</span> 📄 ${escapeHtml(specName)}</span>
          <span class="spec-count">${totalForSpec} failures</span>
        </div>
        <div class="spec-content">
          ${stepsHTML}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

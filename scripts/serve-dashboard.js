const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync, spawn } = require('child_process');

const PORT = 8080;
const REPORT_DIR = path.join(process.cwd(), 'report');
const resultsPath = path.join(REPORT_DIR, 'funnel-results.json');

if (!fs.existsSync(resultsPath)) {
  console.error('No results found. Run tests first.');
  process.exit(1);
}

try {
  const pid = execSync(`lsof -ti:${PORT}`, { encoding: 'utf-8' }).trim();
  if (pid) execSync(`kill -9 ${pid}`);
} catch (e) {}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
fs.writeFileSync(path.join(REPORT_DIR, 'dashboard.html'), generateHTML(results));

const MIME = { '.html': 'text/html', '.json': 'application/json', '.zip': 'application/zip' };

http.createServer((req, res) => {
  const headers = { 'Access-Control-Allow-Origin': '*' };
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    return res.end();
  }

  if (req.url.startsWith('/api/show-trace?')) {
    const p = path.join(process.cwd(), decodeURIComponent(req.url.split('path=')[1]));
    if (fs.existsSync(p)) {
      spawn('npx', ['playwright', 'show-trace', p], { detached: true, stdio: 'ignore' }).unref();
      res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
      return res.end('{"success":true}');
    }
    res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
    return res.end('{"error":"Not found"}');
  }

  let file = req.url === '/' ? path.join(REPORT_DIR, 'dashboard.html') :
    req.url.startsWith('/test-results/') ? path.join(process.cwd(), req.url) :
    path.join(REPORT_DIR, req.url);

  if (!fs.existsSync(file)) {
    res.writeHead(404);
    return res.end('Not found');
  }

  res.writeHead(200, { ...headers, 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}`);
  try { execSync(`open http://localhost:${PORT}`); } catch (e) {}
});

function esc(t) {
  return t ? String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
}

function generateHTML(r) {
  const rate = r.total > 0 ? ((r.passed / r.total) * 100).toFixed(1) : 0;
  
  let failuresHTML = '';
  if (Object.keys(r.failures).length === 0) {
    failuresHTML = '<p class="all-pass">All tests passed!</p>';
  } else {
    for (const [spec, steps] of Object.entries(r.failures)) {
      let specTotal = 0;
      let stepsHTML = '';
      
      for (const [step, errors] of Object.entries(steps)) {
        let stepTotal = 0;
        let errorsHTML = '';
        
        for (const [err, data] of Object.entries(errors)) {
          stepTotal += data.count;
          let tracesHTML = data.traces.map((t, i) => {
            const p = t.trace ? `/test-results/${t.trace.replace('test-results/', '')}` : '#';
            return `<div class="trace-row">Run #${i + 1} <button class="trace-btn" onclick="openTrace('${p}',this)">View</button></div>`;
          }).join('');
          
          errorsHTML += `<details class="error-details"><summary class="error-sum">${esc(err)} <b>(${data.count}x)</b></summary>${tracesHTML}</details>`;
        }
        specTotal += stepTotal;
        stepsHTML += `<details class="step-details"><summary class="step-sum">${esc(step)} <b>(${stepTotal}x)</b></summary>${errorsHTML}</details>`;
      }
      failuresHTML += `<details class="spec-details"><summary class="spec-sum">${esc(spec)} - ${specTotal} failures</summary>${stepsHTML}</details>`;
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Load Test Results</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; padding: 20px; min-height: 100vh;
      background: linear-gradient(180deg, #003399 0%, #0066cc 30%, #3399ff 60%, #66ccff 80%, #99eeff 100%);
      font-family: Tahoma, 'MS Sans Serif', Geneva, sans-serif; font-size: 11px;
    }
    
    .window {
      max-width: 850px; margin: 20px auto;
      border: 1px solid #0055ea; border-radius: 8px 8px 0 0;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.4);
    }
    
    .title-bar {
      background: linear-gradient(180deg, #0a58ca 0%, #3d95f7 10%, #5db3ff 45%, #3d95f7 55%, #0a58ca 100%);
      padding: 4px 6px; border-radius: 6px 6px 0 0;
      display: flex; align-items: center; justify-content: space-between;
    }
    .title-bar-text {
      color: white; font-weight: bold; font-size: 12px;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
      display: flex; align-items: center; gap: 5px;
    }
    .title-bar-text::before { content: '📊'; }
    .title-bar-controls { display: flex; gap: 2px; }
    .title-bar-controls button {
      width: 21px; height: 21px; font-size: 9px; font-weight: bold;
      border: 1px solid #fff; border-radius: 3px; cursor: pointer;
      background: linear-gradient(180deg, #fff 0%, #d4d0c8 100%);
      font-family: 'Webdings', sans-serif;
    }
    .title-bar-controls button:hover { background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%); }
    .title-bar-controls button:active { background: #c0c0c0; }
    .btn-min::after { content: '0'; }
    .btn-max::after { content: '1'; }
    .btn-close { background: linear-gradient(180deg, #e77157 0%, #c54535 100%) !important; color: white !important; }
    .btn-close::after { content: 'r'; }
    
    .window-body {
      background: #ece9d8; padding: 15px;
      border-left: 1px solid #848484; border-right: 1px solid #848484; border-bottom: 1px solid #848484;
    }
    
    .field-row { margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    .field-row label { min-width: 80px; }
    
    .groupbox {
      border: 1px solid #848484; padding: 10px; margin: 10px 0;
      background: linear-gradient(180deg, #f5f4ea 0%, #ece9d8 100%);
    }
    .groupbox legend { background: #ece9d8; padding: 2px 8px; font-weight: bold; color: #003399; }
    
    table { width: 100%; border-collapse: collapse; background: white; border: 2px inset #808080; }
    th { background: linear-gradient(180deg, #f7f7f7 0%, #d4d0c8 100%); padding: 6px 10px; border: 1px solid #808080; text-align: left; }
    td { padding: 6px 10px; border: 1px solid #c0c0c0; }
    .pass { color: #008000; font-weight: bold; }
    .fail { color: #cc0000; font-weight: bold; }
    
    button {
      background: linear-gradient(180deg, #fff 0%, #ece9d8 100%);
      border: 2px outset #d4d0c8; border-radius: 3px;
      padding: 4px 12px; font-family: Tahoma; font-size: 11px; cursor: pointer;
    }
    button:hover { background: linear-gradient(180deg, #fff 0%, #f0ede4 100%); }
    button:active { border-style: inset; background: #d4d0c8; }
    button.viewed { background: linear-gradient(180deg, #b5e7a0 0%, #8ed07c 100%); }
    
    select {
      background: white; border: 2px inset #808080; padding: 2px 4px;
      font-family: Tahoma; font-size: 11px;
    }
    
    .status-bar {
      background: linear-gradient(180deg, #ece9d8 0%, #d4d0c8 100%);
      border-top: 1px solid #fff; padding: 3px 8px;
      display: flex; justify-content: space-between; font-size: 10px;
    }
    .status-bar-field { border: 1px inset #808080; padding: 2px 8px; background: #ece9d8; }
    
    details { margin: 5px 0; }
    summary { cursor: pointer; padding: 4px 8px; background: #d4d0c8; border: 1px solid #808080; }
    summary:hover { background: #e4e0d8; }
    .spec-details { border: 2px inset #808080; margin: 8px 0; }
    .spec-details > summary { background: linear-gradient(180deg, #ffebcd 0%, #ffdead 100%); font-weight: bold; }
    .step-details { margin: 4px 10px; border: 1px solid #c0c0c0; }
    .step-details > summary { background: #fff0f0; color: #cc0000; }
    .error-details { margin: 4px 15px; border: 1px solid #d0d0d0; }
    .error-details > summary { background: #fffacd; font-family: 'Lucida Console', monospace; font-size: 10px; }
    .trace-row { padding: 5px 20px; background: #fafafa; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    
    .all-pass { color: #008000; font-weight: bold; font-size: 14px; text-align: center; padding: 20px; }
    .all-pass::before { content: '✅ '; }
    
    h2 { color: #003399; font-size: 12px; margin: 15px 0 10px; padding-left: 5px; border-left: 3px solid #003399; }
    
    .taskbar {
      position: fixed; bottom: 0; left: 0; right: 0; height: 30px;
      background: linear-gradient(180deg, #3168d5 0%, #4993e6 3%, #306ac7 5%, #0b3a8c 100%);
      border-top: 1px solid #0b3a8c; display: flex; align-items: center; padding: 2px 4px;
    }
    .start-btn {
      background: linear-gradient(180deg, #3b9c3b 0%, #379637 10%, #267326 100%);
      border: none; border-radius: 0 8px 8px 0; padding: 4px 12px 4px 8px;
      color: white; font-weight: bold; font-size: 12px; cursor: pointer;
      display: flex; align-items: center; gap: 4px;
      box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3);
    }
    .start-btn:hover { background: linear-gradient(180deg, #45a845 0%, #40a040 10%, #308030 100%); }
    .start-btn::before { content: '🪟'; font-size: 16px; }
    
    body { padding-bottom: 50px; }
  </style>
</head>
<body>
  <div class="window">
    <div class="title-bar">
      <span class="title-bar-text">Load Test Results - Playwright</span>
      <div class="title-bar-controls">
        <button class="btn-min"></button>
        <button class="btn-max"></button>
        <button class="btn-close"></button>
      </div>
    </div>
    <div class="window-body">
      <div class="groupbox">
        <legend>📈 Test Statistics</legend>
        <table>
          <tr><th>Total Runs</th><th>Passed ✓</th><th>Failed ✗</th><th>Success Rate</th></tr>
          <tr>
            <td><b>${r.total}</b></td>
            <td class="pass">${r.passed}</td>
            <td class="fail">${r.failed}</td>
            <td><b>${rate}%</b></td>
          </tr>
        </table>
      </div>
      
      <h2>⚠️ Failure Details</h2>
      ${failuresHTML}
    </div>
    <div class="status-bar">
      <span class="status-bar-field">Ready</span>
      <span class="status-bar-field">Tests completed at ${new Date().toLocaleTimeString()}</span>
    </div>
  </div>
  
  <div class="taskbar">
    <button class="start-btn">Start</button>
  </div>

  <script>
    function openTrace(path, btn) {
      btn.textContent = 'Loading...';
      btn.disabled = true;
      if (location.protocol === 'https:') {
        window.open('https://trace.playwright.dev/?trace=' + encodeURIComponent(location.origin + path), '_blank');
        btn.textContent = '✓ Viewed';
        btn.classList.add('viewed');
        btn.disabled = false;
      } else {
        fetch('/api/show-trace?path=' + encodeURIComponent(path))
          .then(r => r.json())
          .then(() => { btn.textContent = '✓ Viewed'; btn.classList.add('viewed'); btn.disabled = false; })
          .catch(() => { btn.textContent = 'View'; btn.disabled = false; });
      }
    }
  </script>
</body>
</html>`;
}

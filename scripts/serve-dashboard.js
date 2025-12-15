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

function processTimelineData(timeline, startTime) {
  if (!timeline.length || !startTime) return { labels: [], passed: [], failed: [], cumulative: [] };
  
  const start = new Date(startTime).getTime();
  const bucketSize = 1000;
  const buckets = {};
  
  timeline.forEach(t => {
    const relativeTime = Math.floor((t.completedAt - start) / bucketSize) * bucketSize;
    if (!buckets[relativeTime]) buckets[relativeTime] = { passed: 0, failed: 0 };
    if (t.status === 'passed') buckets[relativeTime].passed++;
    else buckets[relativeTime].failed++;
  });
  
  const times = Object.keys(buckets).map(Number).sort((a, b) => a - b);
  let cumulative = 0;
  
  return {
    labels: times.map(t => (t / 1000).toFixed(0) + 's'),
    passed: times.map(t => buckets[t].passed),
    failed: times.map(t => buckets[t].failed),
    cumulative: times.map(t => {
      cumulative += buckets[t].passed + buckets[t].failed;
      return cumulative;
    })
  };
}

function processDurationDistribution(durations) {
  if (!durations.length) return { labels: [], counts: [] };
  
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const range = max - min || 1000;
  const bucketCount = Math.min(10, durations.length);
  const bucketSize = Math.ceil(range / bucketCount);
  
  const buckets = {};
  for (let i = 0; i < bucketCount; i++) {
    const start = min + i * bucketSize;
    buckets[start] = 0;
  }
  
  durations.forEach(d => {
    const bucket = min + Math.floor((d - min) / bucketSize) * bucketSize;
    const key = Math.min(bucket, min + (bucketCount - 1) * bucketSize);
    buckets[key] = (buckets[key] || 0) + 1;
  });
  
  const keys = Object.keys(buckets).map(Number).sort((a, b) => a - b);
  return {
    labels: keys.map(k => formatDuration(k) + '-' + formatDuration(k + bucketSize)),
    counts: keys.map(k => buckets[k])
  };
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60000);
  const secs = ((ms % 60000) / 1000).toFixed(0);
  return `${mins}m ${secs}s`;
}

function formatTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function generateHTML(r) {
  const rate = r.total > 0 ? ((r.passed / r.total) * 100).toFixed(1) : 0;
  
  const startTime = r.startTime ? new Date(r.startTime) : null;
  const endTime = r.endTime ? new Date(r.endTime) : null;
  const totalDuration = startTime && endTime ? endTime - startTime : 0;
  const avgDuration = r.testDurations && r.testDurations.length > 0 
    ? r.testDurations.reduce((a, b) => a + b, 0) / r.testDurations.length 
    : 0;
  
  const throughput = totalDuration > 0 ? (r.total / (totalDuration / 60000)).toFixed(1) : 0;
  const workers = r.workers || 1;
  
  const stepStats = r.stepStats || {};
  const stepNames = Object.keys(stepStats);
  const stepData = stepNames.map(name => ({
    name,
    total: stepStats[name].total,
    passed: stepStats[name].passed,
    failed: stepStats[name].failed,
    errorRate: stepStats[name].total > 0 
      ? ((stepStats[name].failed / stepStats[name].total) * 100).toFixed(1) 
      : 0
  }));
  const topFailingSteps = [...stepData].filter(s => s.failed > 0).sort((a, b) => b.failed - a.failed).slice(0, 3);
  
  const testTimeline = r.testTimeline || [];
  const timelineData = processTimelineData(testTimeline, startTime);
  const durationBuckets = processDurationDistribution(r.testDurations || []);
  
  const specStats = r.specStats || {};
  const specNames = Object.keys(specStats);
  const specsData = specNames.map((name, idx) => {
    const spec = specStats[name];
    const specStepNames = Object.keys(spec.stepStats || {});
    const specStepData = specStepNames.map(sn => ({
      name: sn,
      total: spec.stepStats[sn].total,
      passed: spec.stepStats[sn].passed,
      failed: spec.stepStats[sn].failed,
      errorRate: spec.stepStats[sn].total > 0 
        ? ((spec.stepStats[sn].failed / spec.stepStats[sn].total) * 100).toFixed(1) 
        : 0
    }));
    const specTimeline = processTimelineData(spec.testTimeline || [], startTime);
    const specDurations = processDurationDistribution(spec.testDurations || []);
    const specAvgDuration = spec.testDurations.length > 0 
      ? spec.testDurations.reduce((a, b) => a + b, 0) / spec.testDurations.length 
      : 0;
    const specTotalDuration = spec.testDurations.reduce((a, b) => a + b, 0);
    const specThroughput = specTotalDuration > 0 ? (spec.total / (specTotalDuration / 60000)).toFixed(1) : 0;
    const topFailing = [...specStepData].filter(s => s.failed > 0).sort((a, b) => b.failed - a.failed)[0];
    
    let specFailuresHTML = '';
    const specFailures = r.failures[name] || {};
    if (Object.keys(specFailures).length === 0) {
      specFailuresHTML = '<p class="all-pass">All tests passed!</p>';
    } else {
      for (const [step, errors] of Object.entries(specFailures)) {
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
        specFailuresHTML += `<details class="step-details"><summary class="step-sum">${esc(step)} <b>(${stepTotal}x)</b></summary>${errorsHTML}</details>`;
      }
    }
    
    return {
      id: idx,
      name,
      total: spec.total,
      passed: spec.passed,
      failed: spec.failed,
      rate: spec.total > 0 ? ((spec.passed / spec.total) * 100).toFixed(1) : 0,
      avgDuration: specAvgDuration,
      throughput: specThroughput,
      topFailing,
      stepData: specStepData,
      timeline: specTimeline,
      durations: specDurations,
      failuresHTML: specFailuresHTML
    };
  });
  
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
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; padding: 20px; min-height: 100vh;
      background: linear-gradient(180deg, #003399 0%, #0066cc 30%, #3399ff 60%, #66ccff 80%, #99eeff 100%);
      font-family: Tahoma, 'MS Sans Serif', Geneva, sans-serif; font-size: 14px;
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
      color: white; font-weight: bold; font-size: 14px;
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
    th { background: linear-gradient(180deg, #f7f7f7 0%, #d4d0c8 100%); padding: 8px 12px; border: 1px solid #808080; text-align: left; font-size: 14px; }
    td { padding: 8px 12px; border: 1px solid #c0c0c0; font-size: 14px; }
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
      border-top: 1px solid #fff; padding: 4px 10px;
      display: flex; justify-content: space-between; font-size: 12px;
    }
    .status-bar-field { border: 1px inset #808080; padding: 2px 8px; background: #ece9d8; }
    
    details { margin: 5px 0; }
    summary { cursor: pointer; padding: 6px 10px; background: #d4d0c8; border: 1px solid #808080; font-size: 14px; }
    summary:hover { background: #e4e0d8; }
    .spec-details { border: 2px inset #808080; margin: 8px 0; }
    .spec-details > summary { background: linear-gradient(180deg, #ffebcd 0%, #ffdead 100%); font-weight: bold; }
    .step-details { margin: 4px 10px; border: 1px solid #c0c0c0; }
    .step-details > summary { background: #fff0f0; color: #cc0000; }
    .error-details { margin: 4px 15px; border: 1px solid #d0d0d0; }
    .error-details > summary { background: #fffacd; font-family: 'Lucida Console', monospace; font-size: 12px; }
    .trace-row { padding: 5px 20px; background: #fafafa; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    
    .all-pass { color: #008000; font-weight: bold; font-size: 16px; text-align: center; padding: 20px; }
    .all-pass::before { content: '✅ '; }
    
    .kpi-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px;
    }
    .kpi-card {
      background: linear-gradient(180deg, #fff 0%, #e8e6de 100%);
      border: 2px inset #808080; padding: 8px; text-align: center;
      position: relative; cursor: help;
    }
    .kpi-card:hover { background: linear-gradient(180deg, #fff 0%, #f0ede4 100%); }
    .kpi-label { font-size: 12px; color: #666; margin-bottom: 4px; }
    .kpi-value { font-size: 18px; font-weight: bold; color: #003399; }
    
    .tooltip {
      visibility: hidden; opacity: 0;
      position: absolute; bottom: calc(100% + 8px); left: 50%;
      transform: translateX(-50%); z-index: 100;
      background: #ffffe1; border: 1px solid #000; padding: 8px 10px;
      font-size: 12px; font-weight: normal; color: #000;
      white-space: nowrap; box-shadow: 2px 2px 3px rgba(0,0,0,0.3);
      transition: opacity 0.15s, visibility 0.15s;
    }
    .tooltip::after {
      content: ''; position: absolute; top: 100%; left: 50%;
      margin-left: -5px; border: 5px solid transparent;
      border-top-color: #000;
    }
    .kpi-card:hover .tooltip { visibility: visible; opacity: 1; }
    
    h2 { color: #003399; font-size: 14px; margin: 15px 0 10px; padding-left: 5px; border-left: 3px solid #003399; }
    
    .chart-container {
      background: white; border: 2px inset #808080; padding: 15px;
      margin-top: 10px; position: relative; height: 250px;
    }
    .no-data { text-align: center; color: #666; padding: 40px; font-style: italic; }
    
    .spec-section {
      border: 2px solid #848484; margin: 15px 0; background: #f5f4ea;
    }
    .spec-section > summary {
      background: linear-gradient(180deg, #0a58ca 0%, #3d95f7 50%, #0a58ca 100%);
      color: white; font-weight: bold; padding: 8px 12px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
    }
    .spec-section > summary:hover { background: linear-gradient(180deg, #1a68da 0%, #4da5ff 50%, #1a68da 100%); }
    .spec-section > summary::marker { color: white; }
    .spec-section-body { padding: 10px; }
    .spec-badge { 
      font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-left: 10px;
    }
    .spec-badge.pass { background: #008000; }
    .spec-badge.fail { background: #cc0000; }
    .spec-mini-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
    .spec-mini-card {
      background: linear-gradient(180deg, #fff 0%, #e8e6de 100%);
      border: 1px inset #808080; padding: 6px; text-align: center; font-size: 12px;
    }
    .spec-mini-card .label { font-size: 10px; color: #666; }
    .spec-mini-card .value { font-weight: bold; color: #003399; }
    .spec-chart { height: 180px; margin-top: 8px; }
    
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
        <legend>📋 Run Summary</legend>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Start Time</div>
            <div class="kpi-value">${formatTime(r.startTime)}</div>
            <div class="tooltip">When the test run started</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">End Time</div>
            <div class="kpi-value">${formatTime(r.endTime)}</div>
            <div class="tooltip">When the test run ended</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Duration</div>
            <div class="kpi-value">${formatDuration(totalDuration)}</div>
            <div class="tooltip">Wall-clock time from start to end</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Threads</div>
            <div class="kpi-value">${workers}</div>
            <div class="tooltip">Number of parallel threads</div>
          </div>
        </div>
      </div>
      
      ${specsData.map(spec => `
        <details class="spec-section">
          <summary>
            <span>📄 ${esc(spec.name)}</span>
            <span>
              <span class="spec-badge pass">${spec.passed} passed</span>
              ${spec.failed > 0 ? `<span class="spec-badge fail">${spec.failed} failed</span>` : ''}
              <span style="margin-left:10px;font-weight:normal;font-size:11px;">${spec.rate}%</span>
            </span>
          </summary>
          <div class="spec-section-body">
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">Total</div>
                <div class="kpi-value">${spec.total}</div>
                <div class="tooltip">Total test executions for this spec</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Passed</div>
                <div class="kpi-value" style="color:#008000">${spec.passed}</div>
                <div class="tooltip">Number of passed tests</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Failed</div>
                <div class="kpi-value" style="color:#cc0000">${spec.failed}</div>
                <div class="tooltip">Number of failed tests</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Error Rate</div>
                <div class="kpi-value">${spec.total > 0 ? ((spec.failed / spec.total) * 100).toFixed(1) : 0}%</div>
                <div class="tooltip">Percentage of failed tests</div>
              </div>
            </div>
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">Avg Duration</div>
                <div class="kpi-value">${formatDuration(Math.round(spec.avgDuration))}</div>
                <div class="tooltip">Average test execution time</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Throughput</div>
                <div class="kpi-value">${spec.throughput}/min</div>
                <div class="tooltip">Tests completed per minute</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Top Failing Step</div>
                <div class="kpi-value" style="font-size: 11px;">${spec.topFailing ? esc(spec.topFailing.name.substring(0, 18)) + (spec.topFailing.name.length > 18 ? '...' : '') : '—'}</div>
                <div class="tooltip">${spec.topFailing ? `${spec.topFailing.failed} failures (${spec.topFailing.errorRate}% error rate)` : 'No failing steps'}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Success Rate</div>
                <div class="kpi-value">${spec.rate}%</div>
                <div class="tooltip">Percentage of passed tests</div>
              </div>
            </div>
            
            ${spec.stepData.length > 0 ? `
            <h2 style="margin-top:15px;">📊 Step Success Rate</h2>
            <div class="chart-container spec-chart"><canvas id="specStepChart${spec.id}"></canvas></div>
            ` : ''}
            
            ${spec.timeline.labels.length > 0 ? `
            <h2>📈 Timeline</h2>
            <div class="chart-container spec-chart"><canvas id="specTimelineChart${spec.id}"></canvas></div>
            ` : ''}
            
            ${spec.durations.labels.length > 0 ? `
            <h2>⏱️ Duration Distribution</h2>
            <div class="chart-container spec-chart"><canvas id="specDurationChart${spec.id}"></canvas></div>
            ` : ''}
            
            <h2>⚠️ Failure Details</h2>
            ${spec.failuresHTML}
          </div>
        </details>
      `).join('')}
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
    
    const specsData = ${JSON.stringify(specsData)};
    specsData.forEach(spec => {
      // Step chart
      if (spec.stepData.length > 0) {
        const stepCanvas = document.getElementById('specStepChart' + spec.id);
        if (stepCanvas) {
          new Chart(stepCanvas.getContext('2d'), {
            type: 'bar',
            data: {
              labels: spec.stepData.map(s => s.name.length > 20 ? s.name.substring(0, 20) + '...' : s.name),
              datasets: [
                { label: 'Passed', data: spec.stepData.map(s => s.passed), backgroundColor: 'rgba(0, 128, 0, 0.7)', borderWidth: 1 },
                { label: 'Failed', data: spec.stepData.map(s => s.failed), backgroundColor: 'rgba(204, 0, 0, 0.7)', borderWidth: 1 }
              ]
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: {
                  title: ctx => spec.stepData[ctx[0].dataIndex].name,
                  afterBody: ctx => 'Error Rate: ' + spec.stepData[ctx[0].dataIndex].errorRate + '%'
                }}
              },
              scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
            }
          });
        }
      }
      
      // Timeline chart
      if (spec.timeline.labels.length > 0) {
        const tlCanvas = document.getElementById('specTimelineChart' + spec.id);
        if (tlCanvas) {
          new Chart(tlCanvas.getContext('2d'), {
            type: 'line',
            data: {
              labels: spec.timeline.labels,
              datasets: [
                { label: 'Cumulative', data: spec.timeline.cumulative, borderColor: 'rgba(0, 51, 153, 1)', backgroundColor: 'rgba(0, 51, 153, 0.1)', fill: true, tension: 0.3, yAxisID: 'y' },
                { label: 'Passed', data: spec.timeline.passed, backgroundColor: 'rgba(0, 128, 0, 0.7)', type: 'bar', yAxisID: 'y1' },
                { label: 'Failed', data: spec.timeline.failed, backgroundColor: 'rgba(204, 0, 0, 0.7)', type: 'bar', yAxisID: 'y1' }
              ]
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { title: { display: true, text: 'Time from start' } },
                y: { position: 'left', beginAtZero: true },
                y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false } }
              }
            }
          });
        }
      }
      
      // Duration chart
      if (spec.durations.labels.length > 0) {
        const durCanvas = document.getElementById('specDurationChart' + spec.id);
        if (durCanvas) {
          new Chart(durCanvas.getContext('2d'), {
            type: 'bar',
            data: {
              labels: spec.durations.labels,
              datasets: [{ data: spec.durations.counts, backgroundColor: 'rgba(0, 102, 204, 0.7)', borderWidth: 1 }]
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }
          });
        }
      }
    });
    
      </script>
</body>
</html>`;
}

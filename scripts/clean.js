const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORT_PORT = 8080;

console.log('🧹 Cleaning up...');

// Kill process on port
try {
  const pid = execSync(`lsof -ti:${REPORT_PORT} 2>/dev/null`, { encoding: 'utf-8' }).trim();
  if (pid && /^\d+$/.test(pid)) {
    execSync(`kill -9 ${pid} 2>/dev/null`);
    console.log(`   Killed process on port ${REPORT_PORT}`);
  }
} catch (e) {
  // No process on port - OK
}

// Remove old reports
const dirsToClean = ['test-results', 'report', 'playwright-report'];

dirsToClean.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`   Removed ${dir}/`);
  }
});

console.log('✅ Clean complete\n');

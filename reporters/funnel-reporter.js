const fs = require('fs');
const path = require('path');

class FunnelReporter {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      startTime: null,
      endTime: null,
      testDurations: [],
      testTimeline: [],
      workers: 1,
      stepStats: {},
      failures: {}
    };
  }

  onBegin(config, suite) {
    this.results.startTime = new Date().toISOString();
    this.results.workers = config.workers || 1;
    this.outputDir = config.outputDir || './test-results';
  }

  onTestEnd(test, result) {
    this.results.total++;
    this.results.testDurations.push(result.duration);
    
    this.results.testTimeline.push({
      completedAt: Date.now(),
      duration: result.duration,
      status: result.status === 'passed' ? 'passed' : 'failed'
    });
    
    this.collectStepStats(result, result.status === 'passed');
    
    if (result.status === 'passed') {
      this.results.passed++;
      return;
    }

    if (result.status === 'failed' || result.status === 'timedOut') {
      this.results.failed++;
      
      const specFile = path.basename(test.location.file);
      const stepName = this.extractFailedStep(result) || 'Unknown step';
      const errorMessage = this.normalizeError(result.error?.message || 'Unknown error');
      const traceFile = this.findTraceFile(result);
      
      if (!this.results.failures[specFile]) {
        this.results.failures[specFile] = {};
      }
      
      if (!this.results.failures[specFile][stepName]) {
        this.results.failures[specFile][stepName] = {};
      }
      
      if (!this.results.failures[specFile][stepName][errorMessage]) {
        this.results.failures[specFile][stepName][errorMessage] = {
          count: 0,
          traces: []
        };
      }
      
      this.results.failures[specFile][stepName][errorMessage].count++;
      
      if (traceFile) {
        this.results.failures[specFile][stepName][errorMessage].traces.push({
          testId: test.id,
          title: test.title,
          trace: traceFile,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  extractFailedStep(result) {
    if (result.steps && result.steps.length > 0) {
      for (const step of result.steps) {
        if (step.error) {
          return step.title;
        }
        const nestedFailed = this.findFailedNestedStep(step);
        if (nestedFailed) return nestedFailed;
      }
    }
    return null;
  }

  findFailedNestedStep(step) {
    if (step.error) return step.title;
    if (step.steps) {
      for (const nested of step.steps) {
        const found = this.findFailedNestedStep(nested);
        if (found) return found;
      }
    }
    return null;
  }

  collectStepStats(result, passed) {
    if (!result.steps) return;
    
    for (const step of result.steps) {
      if (step.category !== 'test.step') continue;
      
      const stepName = step.title;
      if (!this.results.stepStats[stepName]) {
        this.results.stepStats[stepName] = { total: 0, passed: 0, failed: 0 };
      }
      
      this.results.stepStats[stepName].total++;
      if (step.error) {
        this.results.stepStats[stepName].failed++;
      } else {
        this.results.stepStats[stepName].passed++;
      }
    }
  }

  normalizeError(message) {
    return message
      .replace(/\d+ms/g, 'Xms')
      .replace(/localhost:\d+/g, 'localhost:PORT')
      .replace(/\d{4}-\d{2}-\d{2}/g, 'DATE')
      .split('\n')[0]
      .substring(0, 200);
  }

  findTraceFile(result) {
    if (result.attachments) {
      const trace = result.attachments.find(a => a.name === 'trace');
      if (trace && trace.path) {
        return path.relative(process.cwd(), trace.path);
      }
    }
    return null;
  }

  onEnd() {
    this.results.endTime = new Date().toISOString();
    
    const reportDir = path.join(process.cwd(), 'report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(reportDir, 'funnel-results.json'),
      JSON.stringify(this.results, null, 2)
    );
    
    console.log('\n📊 Funnel Test Results:');
    console.log(`   Total: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`\n📁 Results saved to report/funnel-results.json`);
    console.log(`   Run 'npm run dashboard' to view dashboard\n`);
  }
}

module.exports = FunnelReporter;
